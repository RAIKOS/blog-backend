import Post from './models/post';

export default function createFakeData() {
  const posts = [...Array(10).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: `어쩌고 저쩌고 ${i}`,
    tags: ['가짜', '데이터'],
  }));

  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
