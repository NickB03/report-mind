
const HowItWorksSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple 3-Step Process
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              AnalystAI makes it easy to extract insights from complex analyst reports.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
          <StepItem 
            number={1} 
            title="Upload" 
            description="Upload your analyst report PDF through our secure interface."
          />
          <StepItem 
            number={2} 
            title="Process" 
            description="Our AI analyzes the document to extract text, tables, charts, and generates insights."
          />
          <StepItem 
            number={3} 
            title="Analyze" 
            description="View results, download extractions, or chat with AI to gain deeper insights."
          />
        </div>
      </div>
    </section>
  );
};

interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

const StepItem = ({ number, title, description }: StepItemProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-black">
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HowItWorksSection;
