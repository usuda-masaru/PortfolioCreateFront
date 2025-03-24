import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Link,
  Paper,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { QiitaArticle } from '../../types/interfaces';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Article as ArticleIcon } from '@mui/icons-material';

interface QiitaArticlesSectionProps {
  articles: QiitaArticle[];
}

const QiitaArticlesSection: React.FC<QiitaArticlesSectionProps> = ({ articles }) => {
  const theme = useTheme();

  if (!articles || articles.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <ArticleIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5 }} />
        <Typography variant="body1">
          Qiita記事がありません
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid item xs={12} md={6} key={article.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              },
              borderTop: article.is_featured ? `4px solid ${theme.palette.primary.main}` : 'none',
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Avatar 
                  alt="Qiita" 
                  src="https://cdn.qiita.com/assets/favicons/public/production-c620d3e403342b1022967ba5e3db1aaa.ico" 
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: ja })}に投稿
                </Typography>
              </Box>
              
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  lineHeight: 1.3,
                  height: '2.6em'
                }}
              >
                {article.title}
              </Typography>
              
              <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {article.tags.slice(0, 4).map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small" 
                    sx={{ 
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontSize: '0.7rem'
                    }}
                  />
                ))}
                {article.tags.length > 4 && (
                  <Chip 
                    label={`+${article.tags.length - 4}`} 
                    size="small" 
                    sx={{ 
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.grey[500], 0.1),
                      color: theme.palette.grey[600],
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    ❤ {article.likes_count}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.info.main }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    🔖 {article.stocks_count}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                component={Link} 
                href={article.url} 
                target="_blank" 
                rel="noopener"
                color="primary"
                size="small"
                sx={{ 
                  borderRadius: 1.5,
                  textTransform: 'none',
                }}
              >
                記事を読む
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QiitaArticlesSection; 