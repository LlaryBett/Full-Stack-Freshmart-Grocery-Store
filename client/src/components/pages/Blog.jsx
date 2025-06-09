import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Keeping Your Produce Fresh Longer",
    date: "2024-06-01",
    author: "FreshMart Team",
    excerpt:
      "Discover simple ways to store fruits and vegetables so they stay crisp and delicious for days.",
    content: `Keeping your produce fresh is easy with a few simple tricks:
1. Store leafy greens with a paper towel to absorb moisture.
2. Keep tomatoes at room temperature, away from direct sunlight.
3. Store apples and bananas separately to prevent overripening.
4. Use airtight containers for chopped veggies.
5. Don’t wash berries until you’re ready to eat them.

Try these tips and enjoy fresher groceries from FreshMart!`
  },
  {
    id: 2,
    title: "Why Buy Local? The Benefits of Supporting Local Farmers",
    date: "2024-05-20",
    author: "FreshMart Team",
    excerpt:
      "Buying local isn’t just a trend—it’s a way to support your community and enjoy fresher food.",
    content: `When you buy local:
- You support local farmers and the economy.
- You get fresher, more nutritious produce.
- You help reduce the carbon footprint from long-distance shipping.
- You enjoy seasonal variety and unique flavors.

At FreshMart, we partner with local growers to bring you the best!`
  },
  {
    id: 3,
    title: "Quick & Healthy Breakfast Ideas",
    date: "2024-05-10",
    author: "FreshMart Nutritionist",
    excerpt:
      "Start your day right with these easy, nutritious breakfast recipes using FreshMart ingredients.",
    content: `Try these breakfast ideas:
- Overnight oats with berries and nuts.
- Avocado toast on whole grain bread.
- Greek yogurt parfait with granola and honey.
- Scrambled eggs with spinach and tomatoes.

All ingredients available at FreshMart!`
  }
];

const Blog = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-8">FreshMart Blog</h1>
    <p className="text-gray-700 mb-8">
      Welcome to the FreshMart Blog! Here you'll find tips, recipes, and stories to help you eat well and live better.
    </p>
    <div className="space-y-8">
      {blogPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
          <div className="text-sm text-gray-500 mb-2">
            {new Date(post.date).toLocaleDateString()} &middot; {post.author}
          </div>
          <p className="text-gray-700 mb-3">{post.excerpt}</p>
          <details>
            <summary className="text-green-600 cursor-pointer hover:underline">Read More</summary>
            <div className="mt-2 whitespace-pre-line text-gray-700">{post.content}</div>
          </details>
        </div>
      ))}
    </div>
    <div className="mt-12 text-center">
      <Link
        to="/products"
        className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Shop FreshMart Products
      </Link>
    </div>
  </div>
);

export default Blog;
