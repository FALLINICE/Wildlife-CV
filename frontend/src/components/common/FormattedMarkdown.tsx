import React from 'react';
import { 
  ShieldAlert, 
  Leaf, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Activity, 
  AlertTriangle,
  Globe
} from 'lucide-react';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export const parseInlineMarkdown = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-savanna-bone">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-savanna-gold font-serif font-medium">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const getSectionIcon = (headingText: string) => {
    const lower = headingText.toLowerCase();
    if (lower.includes('conservation') || lower.includes('status')) {
      return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('habitat') || lower.includes('distribution')) {
      return <MapPin className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('diet') || lower.includes('food') || lower.includes('feeding')) {
      return <Leaf className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('threat') || lower.includes('poaching') || lower.includes('risk')) {
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
    if (lower.includes('behaviour') || lower.includes('behavior') || lower.includes('social')) {
      return <Activity className="w-4 h-4 text-sky-400" />;
    }
    if (lower.includes('fact') || lower.includes('interest')) {
      return <Sparkles className="w-4 h-4 text-savanna-gold" />;
    }
    if (lower.includes('source') || lower.includes('reference')) {
      return <BookOpen className="w-4 h-4 text-nature-400" />;
    }
    return <Globe className="w-4 h-4 text-savanna-sand" />;
  };

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      const listItems = [...currentList];
      currentList = [];
      elements.push(
        <ul key={`${keyPrefix}-list`} className="my-3 space-y-2 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-nature-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-savanna-gold mt-2"></span>
              <span className="leading-relaxed">{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`line-${idx}`);
      return;
    }

    // Bullet point list item (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemContent = trimmed.slice(2).trim();
      currentList.push(itemContent);
      return;
    }

    // If non-list line arrives, flush any pending list
    flushList(`line-${idx}`);

    // H1 Heading (# Heading)
    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.slice(2).trim();
      elements.push(
        <div key={`h1-${idx}`} className="pb-2 border-b border-nature-800 my-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-savanna-bone tracking-tight">
            {parseInlineMarkdown(headingText)}
          </h2>
        </div>
      );
      return;
    }

    // H2 Heading (## Heading)
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.slice(3).trim();
      elements.push(
        <div key={`h2-${idx}`} className="mt-6 mb-3 flex items-center space-x-2 border-b border-nature-800/80 pb-2">
          <div className="p-1.5 bg-nature-950 rounded-lg border border-nature-800">
            {getSectionIcon(headingText)}
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-savanna-bone tracking-wide">
            {headingText}
          </h3>
        </div>
      );
      return;
    }

    // Key-value / Spec Line (e.g. **Common Name:** ...)
    if (trimmed.startsWith('**') && trimmed.includes(':**')) {
      elements.push(
        <div key={`kv-${idx}`} className="my-1.5 py-1 px-3 bg-nature-950/60 rounded-lg border border-nature-850 text-xs sm:text-sm">
          {parseInlineMarkdown(trimmed)}
        </div>
      );
      return;
    }

    // Normal Paragraph
    elements.push(
      <p key={`p-${idx}`} className="text-xs sm:text-sm text-nature-200 leading-relaxed font-sans my-2.5">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  // Flush remaining list items
  flushList('final');

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};
