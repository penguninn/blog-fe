import { useEffect } from "react";

export function useTitle(title: string, siteName = "Pencraft") {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | ${siteName}` : siteName;
    return () => {
      document.title = prevTitle;
    };
  }, [title, siteName]);
}

export default useTitle;
