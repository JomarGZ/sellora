interface CartItemDetailsProps {
  name: string;
  variant: string;
  price: number;
}

const CartItemDetails = ({ name, variant, price }: CartItemDetailsProps) => {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-foreground truncate">{name}</h3>
      <p className="text-sm text-muted-foreground mt-0.5">{variant}</p>
      <p className="text-sm font-medium text-foreground mt-1">
        ${price.toFixed(2)}
      </p>
    </div>
  );
};

export default CartItemDetails;
