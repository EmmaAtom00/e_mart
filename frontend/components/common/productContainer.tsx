import { Star } from "lucide-react";
import { Product } from "@/interface/type";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, discount, salePrice, reviewsCount, rating, image } =
    product;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 md:p-4 transition hover:shadow-md h-full">
      {/* Image */}
      <div className="relative h-40 md:h-48 w-full mb-3 md:mb-4 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={name}
          className="object-contain w-full h-full"
        />

        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2">{name}</h3>

      {/* Price */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-base md:text-lg font-semibold text-black">${salePrice}</span>
        <span className="text-xs md:text-sm text-gray-400 line-through">${price}</span>
      </div>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-1">
        <Star size={14} className="fill-yellow-400 text-yellow-400 md:w-4 md:h-4" />
        <span className="text-xs md:text-sm font-medium">{rating}</span>
        <span className="text-xs text-gray-500">({reviewsCount})</span>
      </div>
    </div>
  );
};

export default ProductCard;
