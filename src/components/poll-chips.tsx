"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface PollChipsProps {
  options: PollOption[];
  onVote: (optionId: string) => void;
  votedOptionId?: string;
}

export function PollChips({ options, onVote, votedOptionId }: PollChipsProps) {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const hasVoted = votedOptionId === option.id;
        
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={hasVoted ? "default" : "outline"}
              className="relative overflow-hidden"
              onClick={() => onVote(option.id)}
            >
              <span className="relative z-10">
                {option.label} ({option.votes})
              </span>
              {totalVotes > 0 && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-primary/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}