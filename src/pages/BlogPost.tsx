
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogData';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import NotFound from './NotFound';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-16 md:mt-20">
        {/* Back link */}
        <div className="container mx-auto px-4 py-8">
          <Link to="/blog">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Button>
          </Link>
        </div>

        {/* Article header */}
        <article className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-constalib-light-blue/20 rounded-full flex items-center justify-center">
                  <post.icon className="w-12 h-12 text-constalib-blue" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-constalib-dark mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-constalib-dark-gray mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  {post.category}
                </div>
              </div>
              
              <p className="text-lg md:text-xl text-constalib-dark-gray leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-constalib-dark leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags && (
              <div className="mt-12 pt-8 border-t border-constalib-light-gray">
                <h3 className="font-semibold text-constalib-dark mb-4">Mots-clés :</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-constalib-light-blue text-constalib-blue text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
