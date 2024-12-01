import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  {
    question: "What is Swago?",
    answer: "Swago is a platform that allows you to trade opinions.",
  },
  {
    question: "What is NFT marketplace?",
    answer: "Swago is a platform that allows you to trade opinions.",
  },
  {
    question: "How does it work?",
    answer: "Swago is a platform that allows you to trade opinions.",
  },
  {
    question: "What is the Swago?",
    answer: "Swago is a platform that allows you to trade opinions.",
  },
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="border-b py-7 border-white/30"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex w-full">
        <h3 className="flex items-center justify-between flex-1 mt-10 text-lg font-bold cursor-pointer">
          {question}
          {isOpen ? (
            <ion-icon name="remove-sharp"></ion-icon>
          ) : (
            <ion-icon name="add-sharp"></ion-icon>
          )}
        </h3>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: "16px",
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQs = () => {
  return (
    <div
      id="faqs"
      className="text-white bg-black py-[72px] sm:py-24 bg-gradient-to-b from-[#4b2387] to-black"
    >
      <div className="container">
        <h2 className="text-5xl font-bold tracking-tighter text-center sm:text-6xl">
          Frequently asked questions
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="mt-5 text-xl text-center text-white/70">
            Here are some frequently asked questions.
          </p>
        </div>
        <div className="max-w-2xl mx-auto mt-12">
          {items.map(({ question, answer }) => (
            <AccordionItem key={question} question={question} answer={answer} />
          ))}
        </div>
      </div>
    </div>
  );
};
