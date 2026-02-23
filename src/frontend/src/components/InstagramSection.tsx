import { SiInstagram } from 'react-icons/si';

export default function InstagramSection() {
  return (
    <section className="bg-luxury-black py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 font-serif text-4xl font-bold text-luxury-white md:text-5xl">
          Follow Our Journey
        </h2>
        <p className="mb-8 text-lg text-luxury-champagne">
          Stay updated with our latest collections and exclusive timepieces
        </p>
        <a
          href="https://instagram.com/luxury_in_times_"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 rounded-full border-2 border-luxury-gold bg-transparent px-8 py-4 font-serif text-lg font-semibold text-luxury-gold transition-all hover:bg-luxury-gold hover:text-luxury-black hover:shadow-luxury"
        >
          <SiInstagram className="h-6 w-6 transition-transform group-hover:scale-110" />
          @luxury_in_times_
        </a>
      </div>
    </section>
  );
}
