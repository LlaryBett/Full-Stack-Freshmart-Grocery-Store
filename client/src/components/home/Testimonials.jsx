import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
	{
		id: 1,
		name: 'Sarah Johnson',
		location: 'New York',
		rating: 5,
		text: 'FreshMart has completely changed how I shop for groceries. The produce is always fresh, and delivery is consistently on time. The app is easy to use, and customer service is exceptional!',
		image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
	},
	{
		id: 2,
		name: 'Michael Chen',
		location: 'San Francisco',
		rating: 5,
		text: 'I love the quality of products from FreshMart. Everything arrives fresh and well-packaged. Their 30-minute delivery option is a lifesaver when I need ingredients quickly!',
		image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
	},
	{
		id: 3,
		name: 'Emily Rodriguez',
		location: 'Chicago',
		rating: 4,
		text: 'Great selection of organic products and the prices are competitive. I appreciate how they source from local farmers. The loyalty program is an added bonus!',
		image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
	},
	{
		id: 4,
		name: 'David Wilson',
		location: 'Miami',
		rating: 5,
		text: 'The convenience of FreshMart is unmatched. I can order everything I need in minutes, and it arrives perfectly every time. Their seasonal specials are always exciting too!',
		image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
	},
];

const Testimonials = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
	};

	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
						What Our Customers Say
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Don't just take our word for it. Here's what our satisfied customers have to say
						about their FreshMart experience.
					</p>
				</div>

				<div className="relative max-w-4xl mx-auto">
					<div className="overflow-hidden">
						<div
							className="flex transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentIndex * 100}%)` }}
						>
							{testimonials.map((testimonial) => (
								<div key={testimonial.id} className="w-full flex-shrink-0 px-4">
									<div className="bg-gray-50 rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start">
										<div className="mb-6 md:mb-0 md:mr-6">
											<div className="w-20 h-20 rounded-full overflow-hidden">
												<img
													src={testimonial.image}
													alt={testimonial.name}
													className="w-full h-full object-cover"
												/>
											</div>
										</div>
										<div>
											<div className="flex items-center mb-2">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														size={16}
														className={
															i < testimonial.rating
																? 'text-yellow-400 fill-yellow-400'
																: 'text-gray-300'
														}
													/>
												))}
											</div>
											<p className="text-gray-700 italic mb-4">
												"{testimonial.text}"
											</p>
											<div>
												<h4 className="font-semibold text-gray-800">
													{testimonial.name}
												</h4>
												<p className="text-gray-500 text-sm">
													{testimonial.location}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-center mt-8 space-x-2">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-3 h-3 rounded-full transition-colors ${
									index === currentIndex ? 'bg-green-500' : 'bg-gray-300'
								}`}
								aria-label={`Go to testimonial ${index + 1}`}
							/>
						))}
					</div>

					<button
						onClick={prevTestimonial}
						className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-gray-900 transition-colors"
						aria-label="Previous testimonial"
					>
						<ChevronLeft size={24} />
					</button>

					<button
						onClick={nextTestimonial}
						className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-gray-900 transition-colors"
						aria-label="Next testimonial"
					>
						<ChevronRight size={24} />
					</button>
				</div>
			</div>
			{/* Newsletter subscription section */}
			<div className="container mx-auto px-4 mt-12">
				<div className="bg-green-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
					<div className="mb-4 md:mb-0">
						<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
							Subscribe to our Newsletter
						</h3>
						<p className="text-gray-600">
							Get the latest updates, offers, and fresh arrivals delivered to your inbox.
						</p>
					</div>
					<form className="flex w-full md:w-auto mt-4 md:mt-0">
						<input
							type="email"
							required
							placeholder="Enter your email"
							className="w-full md:w-72 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
						/>
						<button
							type="submit"
							className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-r-md font-medium transition-colors"
						>
							Subscribe
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;