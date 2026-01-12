-- Insert three dummy influencers with realistic data
INSERT INTO public.influencers (
  name, 
  platform, 
  follower_count, 
  engagement_rate, 
  match_score, 
  categories, 
  location, 
  tags, 
  profile_image,
  email
) VALUES 
(
  'Sofia Martinez',
  'Instagram', 
  125000, 
  4.2, 
  85, 
  'Fashion, Lifestyle, Beauty', 
  'São Paulo, Brazil', 
  'fashion,lifestyle,beauty,brazilian,sustainability', 
  '/src/assets/sofia-martinez.jpg',
  'sofia.martinez@email.com'
),
(
  'James Thompson',
  'LinkedIn', 
  89000, 
  3.8, 
  92, 
  'Technology, Business, Entrepreneurship', 
  'London, United Kingdom', 
  'tech,business,startup,fintech,ai', 
  '/src/assets/james-thompson.jpg',
  'james.thompson@email.com'
),
(
  'Maya Chen',
  'Instagram', 
  156000, 
  5.1, 
  88, 
  'Fitness, Wellness, Health', 
  'Los Angeles, United States', 
  'fitness,wellness,health,yoga,nutrition', 
  '/src/assets/maya-chen.jpg',
  'maya.chen@email.com'
);