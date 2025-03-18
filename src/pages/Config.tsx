
import Layout from "@/components/Layout";
import ConfigForm from "@/components/ConfigForm";

const Config = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Configuration</h1>
            <p className="text-muted-foreground mt-1">
              Manage vendor recognition, report patterns, and API settings
            </p>
          </div>

          <ConfigForm />
        </div>
      </div>
    </Layout>
  );
};

export default Config;
