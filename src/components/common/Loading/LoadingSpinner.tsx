const LoadingSpinner = () => {
  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-transparent" />
    </div>
  );
};

export default LoadingSpinner;
