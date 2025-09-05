const Unauthorized = () => {
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
