
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts } from '@/data/blogData';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-16 md:mt-20">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-constalib-light-blue/30 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-constalib-dark mb-6">
                Blog <span className="text-constalib-blue">Constat Amiable</span>
              </h1>
              <p className="text-lg md:text-xl text-constalib-dark-gray mb-8">
                Guides, conseils et actualités sur le constat amiable, l'assurance auto et les accidents de la route
              </p>
            </div>
          </div>
        </section>

        {/* Articles list */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="aspect-video bg-constalib-light-blue/20 rounded-lg mb-4 flex items-center justify-center">
                      <post.icon className="w-12 h-12 text-constalib-blue" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="hover:text-constalib-blue transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-constalib-dark-gray">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-constalib-dark-gray mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full group">
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SEO section */}
        <section className="py-16 bg-constalib-light-gray/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-constalib-dark mb-6">
                Tout Savoir sur le Constat Amiable
              </h2>
              <p className="text-constalib-dark-gray leading-relaxed">
                Notre blog vous accompagne dans la compréhension du <strong>constat amiable</strong> et de ses enjeux. 
                Découvrez nos guides pratiques pour bien remplir un <strong>constat amiable automobile</strong>, 
                comprendre vos droits en cas d'accident de voiture, et optimiser vos relations avec votre 
                <strong>assurance auto</strong>. Des conseils d'experts pour tous les conducteurs français.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
