import { useEffect } from 'react';

/**
 * Custom hook to set the page title
 * @param title The title of the page to set
 * @param siteName The name of the website, default is "Pengunin"
 */
export function useTitle(title: string, siteName = 'Pengunin') {
  useEffect(() => {
    // Save the old title to restore when the component unmounts
    const prevTitle = document.title;
    
    // Set the new title
    document.title = title ? `${title} | ${siteName}` : siteName;
    
    // Restore the old title when the component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [title, siteName]);
}

export default useTitle; 