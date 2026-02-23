import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Watch = {
    id : Nat;
    name : Text;
    company : Text;
    modelNumber : Text;
    price : Nat;
    gender : Text;
    description : Text;
    images : [Blob];
    isFeatured : Bool;
  };

  module Watch {
    public func compareByPrice(a : Watch, b : Watch) : Order.Order {
      Nat.compare(a.price, b.price);
    };
  };

  type CartItem = {
    watchId : Nat;
    quantity : Nat;
  };

  let watches = Map.empty<Nat, Watch>();
  let carts = Map.empty<Text, [CartItem]>();

  var nextWatchId = 8;

  public shared ({ caller }) func addWatch(
    name : Text,
    company : Text,
    modelNumber : Text,
    price : Nat,
    gender : Text,
    description : Text,
    images : [Blob],
    isFeatured : Bool,
  ) : async Nat {
    if (images.size() > 5) {
      Runtime.trap("A watch can have up to 5 images");
    };

    let watchId = nextWatchId;
    let watch : Watch = {
      id = watchId;
      name;
      company;
      modelNumber;
      price;
      gender;
      description;
      images;
      isFeatured;
    };

    watches.add(watchId, watch);
    nextWatchId += 1;
    watchId;
  };

  public shared ({ caller }) func updateWatch(
    id : Nat,
    name : Text,
    company : Text,
    modelNumber : Text,
    price : Nat,
    gender : Text,
    description : Text,
    images : [Blob],
    isFeatured : Bool,
  ) : async () {
    if (images.size() > 5) {
      Runtime.trap("A watch can have up to 5 images");
    };

    switch (watches.get(id)) {
      case (null) { Runtime.trap("Watch not found") };
      case (?_) {
        let updatedWatch : Watch = {
          id;
          name;
          company;
          modelNumber;
          price;
          gender;
          description;
          images;
          isFeatured;
        };
        watches.add(id, updatedWatch);
      };
    };
  };

  public shared ({ caller }) func deleteWatch(id : Nat) : async () {
    if (not watches.containsKey(id)) {
      Runtime.trap("Watch not found");
    };
    watches.remove(id);
  };

  public query ({ caller }) func getWatch(id : Nat) : async ?Watch {
    watches.get(id);
  };

  public query ({ caller }) func getAllWatches() : async [Watch] {
    let iter = watches.values();
    iter.toArray();
  };

  public query ({ caller }) func searchWatches(searchTerm : Text) : async [Watch] {
    let iter = watches.values();
    iter.toArray().filter(
      func(watch) {
        watch.name.toLower().contains(#text(searchTerm.toLower())) or
        watch.company.toLower().contains(#text(searchTerm.toLower())) or
        watch.modelNumber.toLower().contains(#text(searchTerm.toLower()));
      }
    );
  };

  public query ({ caller }) func getFeaturedWatches() : async [Watch] {
    watches.values().toArray().filter(func(watch) { watch.isFeatured });
  };

  public shared ({ caller }) func addToCart(userId : Text, watchId : Nat, quantity : Nat) : async () {
    let cart = switch (carts.get(userId)) {
      case (null) { [] };
      case (?existingCart) { existingCart };
    };

    let watchExists = watches.containsKey(watchId);

    if (not watchExists) {
      Runtime.trap("Watch not found in inventory");
    };

    let updatedCart : [CartItem] = switch (cart.find(func(item) { item.watchId == watchId })) {
      case (?existingItemIndex) {
        cart.map(
          func(item) {
            if (item.watchId == watchId) {
              { watchId; quantity = quantity + item.quantity };
            } else {
              item;
            };
          }
        );
      };
      case (null) { cart.concat([ { watchId; quantity } ]) };
    };

    carts.add(userId, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(userId : Text, watchId : Nat) : async () {
    switch (carts.get(userId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.watchId != watchId });
        carts.add(userId, updatedCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(userId : Text, watchId : Nat, quantity : Nat) : async () {
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (carts.get(userId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let updatedCart = cart.map(
          func(item) {
            if (item.watchId == watchId) {
              { item with quantity };
            } else {
              item;
            };
          }
        );
        carts.add(userId, updatedCart);
      };
    };
  };

  public query ({ caller }) func getCart(userId : Text) : async [CartItem] {
    switch (carts.get(userId)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public query ({ caller }) func getCartTotal(userId : Text) : async Nat {
    switch (carts.get(userId)) {
      case (null) { 0 };
      case (?cart) {
        var total = 0;
        for (item in cart.values()) {
          switch (watches.get(item.watchId)) {
            case (null) {};
            case (?watch) {
              total += watch.price * item.quantity;
            };
          };
        };
        total;
      };
    };
  };

  public shared ({ caller }) func clearCart(userId : Text) : async () {
    carts.remove(userId);
  };
};
