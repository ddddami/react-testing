import ProductForm from "../components/ProductForm";

const PlaygroundPage = () => {
  return <ProductForm onSubmit={() => console.log("..")} />;
};

export default PlaygroundPage;
