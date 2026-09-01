import React, { useState, useEffect } from 'react';
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
import { Footer } from './components/Footer';
import { ToolId, PageView } from './types';
import { TOOLS_LIST } from './data/toolsData';
import { getBlogPostById } from './data/blogs';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeTool, setActiveTool] = useState<ToolId>('compressor');
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number>(1);

  // Dynamically update document title and meta description based on current view and active content
  useEffect(() => {
    if (currentView === 'home') {
      document.title = 'imageresize.store — Free 50KB Image Compressor, Resizer & BG Remover';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Compress images to 50KB & 20KB for Indian exam forms, passport photo maker 35x45mm, WhatsApp DP resizer without crop, and AI background remover. 100% client-side.');
      }
    } else if (currentView === 'blog-hub') {
      document.title = '100 Free Image Editing Guides & Masterclasses | imageresize.store';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Explore 100 step-by-step tutorials and masterclasses for image compression to 50KB, Aadhaar resizing, WhatsApp DP without crop, passport photos, and background removal.');
      }
    } else if (currentView === 'blog-post') {
      const post = getBlogPostById(selectedBlogPostId);
      if (post) {
        document.title = `${post.title} | imageresize.store`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', post.excerpt);
        }
      }
    } else if (currentView === 'all-tools') {
      document.title = 'All Free Online Image Tools Directory | imageresize.store';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Browse all 12 free in-browser image tools: 50KB Compressor, AI Background Remover, JPG to PDF, Passport Photo Maker, and HEIC to JPG.');
      }
    } else {
      // Individual Dedicated Tool View
      const meta = TOOLS_LIST.find((t) => t.id === activeTool) || TOOLS_LIST[0];
      if (meta) {
        document.title = `${meta.seoTitle} | imageresize.store`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', meta.seoDescription);
        }
      }
    }
  }, [currentView, activeTool, selectedBlogPostId]);

  // Navigation actions
  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (id: ToolId) => {
    setActiveTool(id);
    setCurrentView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBlog = () => {
    setCurrentView('blog-hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToolsDirectory = () => {
    setCurrentView('all-tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlogPost = (id: number) => {
    setSelectedBlogPostId(id);
    setCurrentView('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      />
    </div>
  );
}
