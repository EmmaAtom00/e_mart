export type InputType = {
  type: string;
  className: string;
  label: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  salePrice: number;
  reviewsCount: number;
  rating: number;
  image: string;
};
