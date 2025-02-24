const ClientPage = ({ post }: {
    post: {
    markdown:string
}}) => {

  return (<div className="w-full  max-w-[1280px] m-auto px-3 py-8">
    {post.markdown}
  </div>);
};
export default ClientPage;

