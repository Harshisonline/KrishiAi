export default function Card({
    image,
    onClick,
    heading,
    description,
  }: {
    image: string;
    onClick: () => void;
    heading:string;
    description:string;
  }) {
    return (
      <div
        className="flex flex-col justify-center items-center bg-cardfront w-60 h-60 rounded-md cursor-pointer m-10 "
        onClick={onClick}
      >
        <img src={image} alt="Card" className="w-20 h-20" />
        <h1 className="text-tertiary font-semibold text-xl">
            {heading}
        </h1>
        <p className="text-tertiary text-sm max-w-50 text-center ">
            {description}
        </p>
      </div>
    );
  }
  