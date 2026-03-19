interface CartHeaderProps {
  isLoading: boolean;
  onToggleLoading: () => void;
}

const CartHeader = ({ isLoading, onToggleLoading }: CartHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
      <div className="flex gap-2">
        <button
          onClick={onToggleLoading}
          className="text-xs px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-border transition-colors"
        >
          {isLoading ? "Stop Loading" : "Simulate Loading"}
        </button>
      </div>
    </div>
  );
};

export default CartHeader;
