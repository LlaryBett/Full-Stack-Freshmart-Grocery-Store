import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const PromoSection = () => {
	const containerRef = useRef();
	const [promos, setPromos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPromos = async () => {
			try {
				const res = await fetch(`${backendUrl}/api/promos`);
				if (!res.ok) throw new Error('Failed to fetch promotions');
				const data = await res.json();
				setPromos(data);
			} catch (err) {
				setPromos([]);
			} finally {
				setLoading(false);
			}
		};
		fetchPromos();
	}, []);

	const scroll = (direction) => {
		const container = containerRef.current;
		if (container) {
			const scrollAmount = 400;
			container.scrollTo({
				left:
					direction === 'left'
						? container.scrollLeft - scrollAmount
						: container.scrollLeft + scrollAmount,
				behavior: 'smooth',
			});
		}
	};

	return (
		<section className="py-12 bg-white">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800">
						Promotions
					</h2>
					<div className="flex space-x-2">
						<button
							onClick={() => scroll('left')}
							className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							onClick={() => scroll('right')}
							className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
						>
							<ChevronRight size={20} />
						</button>
					</div>
				</div>
				{loading ? (
					<div>Loading promotions...</div>
				) : (
					<>
						<div
							ref={containerRef}
							className="flex overflow-x-auto scrollbar-hide space-x-6 pb-2"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{promos.map((promo, idx) => (
								<div
									key={idx}
									className={`flex-shrink-0 w-96 bg-gradient-to-r ${promo.bg} rounded-2xl overflow-hidden`}
								>
									<div className="flex flex-col md:flex-row items-center">
										<div className="p-6 md:p-8 flex-1">
											<span
												className={`inline-block px-3 py-1 bg-${promo.badge?.color}-100 text-${promo.badge?.color}-600 rounded-full text-sm font-medium mb-4`}
											>
												{promo.badge?.text}
											</span>
											<h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
												{promo.title}
											</h3>
											<p className="text-gray-600 mb-4">{promo.desc}</p>
											<Link
												to={promo.link}
												className={`inline-flex items-center text-${promo.badge?.color}-600 font-medium hover:text-${promo.badge?.color}-700 transition-colors`}
											>
												{promo.linkText}{' '}
												<ArrowRight size={16} className="ml-1" />
											</Link>
										</div>
										<div className="md:w-1/3 p-4">
											<img
												src={promo.img}
												alt={promo.alt}
												className="w-full h-auto rounded-xl"
											/>
										</div>
									</div>
								</div>
							))}
						</div>
						{/* Data discover navigation dots */}
						<div className="flex justify-center mt-6 space-x-3">
							{promos.map((promo, idx) => (
								<button
									key={idx}
									onClick={() => {
										const container = containerRef.current;
										if (container) {
											const scrollTo = idx * 400;
											container.scrollTo({ left: scrollTo, behavior: 'smooth' });
										}
									}}
									className={`w-3 h-3 rounded-full transition-colors ${
										promo.badge?.color === 'green'
											? 'bg-green-500'
											: promo.badge?.color === 'orange'
											? 'bg-orange-500'
											: promo.badge?.color === 'blue'
											? 'bg-blue-500'
											: promo.badge?.color === 'purple'
											? 'bg-purple-500'
											: 'bg-gray-300'
									}`}
									aria-label={`Go to promo ${idx + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default PromoSection;