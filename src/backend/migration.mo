import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";

module {
  type OldWatch = {
    id : Nat;
    name : Text;
    company : Text;
    modelNumber : Text;
    price : Nat;
    gender : Text;
    description : Text;
    image : Blob;
    isFeatured : Bool;
  };

  type OldActor = {
    watches : Map.Map<Nat, OldWatch>;
    carts : Map.Map<Text, [CartItem]>;
    nextWatchId : Nat;
  };

  type CartItem = {
    watchId : Nat;
    quantity : Nat;
  };

  type NewWatch = {
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

  type NewActor = {
    watches : Map.Map<Nat, NewWatch>;
    carts : Map.Map<Text, [CartItem]>;
    nextWatchId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newWatches = old.watches.map<Nat, OldWatch, NewWatch>(
      func(_id, oldWatch) {
        {
          oldWatch with
          images = [oldWatch.image]
        };
      }
    );
    {
      old with
      watches = newWatches;
    };
  };
};
