
import React from 'react';
import { MOCK_FEED_ITEMS } from '../constants';
import type { FeedItem } from '../types';

const FeedCard: React.FC<{ item: FeedItem }> = ({ item }) => (
    <div className="bg-card-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="p-5">
            <div className="flex items-start">
                <div className="flex-shrink-0 text-primary">
                    {item.icon}
                </div>
                <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold font-heading text-text-dark">{item.title}</h3>
                    {item.author && <p className="text-sm text-text-muted mt-1">{item.author}</p>}
                    <p className="mt-2 text-sm text-text-dark leading-relaxed">{item.description}</p>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
            <div className="text-right">
                <button className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
                    {item.actionText} &rarr;
                </button>
            </div>
        </div>
    </div>
);

const Feed: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading text-text-dark">Your Career IQ Feed</h2>
            <div className="grid gap-6 lg:grid-cols-1">
                {MOCK_FEED_ITEMS.map(item => (
                    <FeedCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
