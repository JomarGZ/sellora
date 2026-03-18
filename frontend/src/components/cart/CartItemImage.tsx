interface CartItemImageProps {
  src: string;
  alt: string;
}

const CartItemImage = ({ src, alt }: CartItemImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-24 h-24 rounded-lg object-cover shrink-0 self-center md:self-start"
    />
  );
};

export default CartItemImage;
