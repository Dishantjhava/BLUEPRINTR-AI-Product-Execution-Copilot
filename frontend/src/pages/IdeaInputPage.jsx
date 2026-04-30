import React, { useState } from 'react';

const IdeaInputPage = () => {
  const [idea, setIdea] = useState('');

  return (
    <div className="bg-white shadow-xl sm:rounded-2xl p-8 max-w-3xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Input Your Idea</h2>
      <p className="text-lg text-gray-500 mb-8">Describe your startup idea and let the AI copilot build its architecture, wireframes, and business plans for you.</p>
      
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label htmlFor="idea" className="block text-sm font-semibold text-gray-700 mb-2">Your Idea</label>
          <div className="relative rounded-md shadow-sm">
            <textarea
              id="idea"
              rows={5}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="block w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-4 border bg-gray-50 transition-colors"
              placeholder="e.g. I want to build a platform that connects freelance designers with boutique..."
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Analyze Idea
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaInputPage;
