import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ToolPageWrapper } from './components/ToolPageWrapper';
import { ImageCompressor } from './components/ImageCompressor';
import { BackgroundRemover } from './components/BackgroundRemover';
import { ImageToPdf } from './components/ImageToPdf';
import { PhotoResizer } from './components/PhotoResizer';
import { PassportPhotoMaker } from './components/PassportPhotoMaker';
import { WhatsAppDpResizer } from './components/WhatsAppDpResizer';
import { GovtFormResizer } from './components/GovtFormResizer';
import { ImageConverter } from './components/ImageConverter';
import { PhotoCropper } from './components/PhotoCropper';
import { HeicToJpgConverter } from './components/HeicToJpgConverter';
import { BulkImageCompressor } from './components/BulkImageCompressor';
import { BlogHub } from './components/BlogHub';
import { BlogPostView } from './components/BlogPostView';
import { ToolsDirectory } from './components/ToolsDirectory';
import { LegalPages } from './components/LegalPages';
import { Footer } from './components/Footer';
import { ToolId, PageView } from './types';
import { TOOLS_LIST } from './data/toolsData';
import { getBlogPostById } from './data/blogs';
import {
  parseCurrentRoute,
  syncBrowserUrl,
  updatePageSeo,
} from './utils/seoRouting';

export default function App() {
  // Initialize state based on the current window.location.pathname
  const [currentView, setCurrentView] = useState<PageView>(() => {
    const route = parseCurrentRoute();
    return route.currentView;
  });

  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    const route = parseCurrentRoute();
    return route.activeTool || 'compressor';
  });

  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number>(() => {
    const route = parseCurrentRoute();
    return route.selectedBlogPostId || 1;
  });

  // Master SEO and document update effect
  useEffect(() => {
    updatePageSeo(currentView, activeTool, selectedBlogPostId);
  }, [currentView, activeTool, selectedBlogPostId]);

  // Handle browser Back / Forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setCurrentView(route.currentView);
      if (route.activeTool) setActiveTool(route.activeTool);
      if (route.selectedBlogPostId) setSelectedBlogPostId(route.selectedBlogPostId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation actions with automatic URL syncing and smooth scroll
  const handleNavigateHome = useCallback(() => {
    setCurrentView('home');
    syncBrowserUrl('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectTool = useCallback((id: ToolId) => {
    setActiveTool(id);
    setCurrentView(id);
    syncBrowserUrl(id, id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateBlog = useCallback(() => {
    setCurrentView('blog-hub');
    syncBrowserUrl('blog-hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateToolsDirectory = useCallback(() => {
    setCurrentView('all-tools');
    syncBrowserUrl('all-tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectBlogPost = useCallback((id: number) => {
    setSelectedBlogPostId(id);
    setCurrentView('blog-post');
    syncBrowserUrl('blog-post', undefined, id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigatePage = useCallback((page: PageView) => {
    setCurrentView(page);
    syncBrowserUrl(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderActiveToolComponent = () => {
    switch (activeTool) {
      case 'compressor':
      case 'target-kb':
        return <ImageCompressor initialTargetKB={50} />;
      case 'bg-remover':
        return <BackgroundRemover />;
      case 'img-to-pdf':
        return <ImageToPdf />;
      case 'resizer':
        return <PhotoResizer />;
      case 'passport':
        return <PassportPhotoMaker />;
      case 'whatsapp-dp':
        return <WhatsAppDpResizer />;
      case 'govt-form':
        return <GovtFormResizer />;
      case 'converter':
        return <ImageConverter />;
      case 'cropper':
        return <PhotoCropper />;
      case 'heic-to-jpg':
        return <HeicToJpgConverter />;
      case 'bulk-compress':
        return <BulkImageCompressor />;
      default:
        return <ImageCompressor initialTargetKB={50} />;
    }
  };

  const activePost = getBlogPostById(selectedBlogPostId) || getBlogPostById(1)!;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        currentView={currentView}
        activeTool={activeTool}
        onNavigateHome={handleNavigateHome}
        onSelectTool={handleSelectTool}
        onNavigateBlog={handleNavigateBlog}
        onNavigateToolsDirectory={handleNavigateToolsDirectory}
        onSelectBlogPost={handleSelectBlogPost}
        onNavigatePage={handleNavigatePage}
      />

      {/* Main Routing Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' ? (
          <HomePage
            onSelectTool={handleSelectTool}
            onNavigateBlog={handleNavigateBlog}
            onSelectBlogPost={handleSelectBlogPost}
            onNavigateToolsDirectory={handleNavigateToolsDirectory}
          />
        ) : currentView === 'blog-hub' ? (
          <BlogHub
            onSelectPost={handleSelectBlogPost}
            onLaunchTool={handleSelectTool}
          />
        ) : currentView === 'blog-post' ? (
          <BlogPostView
            post={activePost}
            onBackToBlog={handleNavigateBlog}
            onSelectPost={handleSelectBlogPost}
            onLaunchTool={handleSelectTool}
          />
        ) : currentView === 'all-tools' ? (
          <ToolsDirectory onSelectTool={handleSelectTool} />
        ) : currentView === 'privacy-policy' || currentView === 'terms-of-service' || currentView === 'about-us' || currentView === 'contact-us' || currentView === 'disclaimer' ? (
          <LegalPages
            pageType={currentView}
            onNavigateHome={handleNavigateHome}
            onNavigatePage={handleNavigatePage}
          />
        ) : (
          /* Dedicated Standalone Tool Page */
          <ToolPageWrapper
            toolId={activeTool}
            onNavigateHome={handleNavigateHome}
            onSelectTool={handleSelectTool}
            onSelectBlogPost={handleSelectBlogPost}
            onNavigateBlog={handleNavigateBlog}
            onNavigateToolsDirectory={handleNavigateToolsDirectory}
          >
            {renderActiveToolComponent()}
          </ToolPageWrapper>
        )}
      </main>

      {/* Global SEO Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onNavigateBlog={handleNavigateBlog}
        onNavigateToolsDirectory={handleNavigateToolsDirectory}
        onSelectBlogPost={handleSelectBlogPost}
        onNavigatePage={handleNavigatePage}
      />
    </div>
  );
}
