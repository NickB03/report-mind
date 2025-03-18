
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

const ConfigForm = () => {
  const [vendors, setVendors] = useState<string[]>(["Gartner", "Forrester", "IDC"]);
  const [newVendor, setNewVendor] = useState("");
  const [patterns, setPatterns] = useState<string[]>([
    "Magic Quadrant", 
    "Wave", 
    "MarketScape"
  ]);
  const [newPattern, setNewPattern] = useState("");
  const [apiKey, setApiKey] = useState("");

  const addVendor = () => {
    if (!newVendor.trim()) return;
    if (vendors.includes(newVendor.trim())) {
      toast.error("Vendor already exists");
      return;
    }
    setVendors([...vendors, newVendor.trim()]);
    setNewVendor("");
    toast.success("Vendor added successfully");
  };

  const removeVendor = (vendor: string) => {
    setVendors(vendors.filter((v) => v !== vendor));
    toast.success("Vendor removed successfully");
  };

  const addPattern = () => {
    if (!newPattern.trim()) return;
    if (patterns.includes(newPattern.trim())) {
      toast.error("Pattern already exists");
      return;
    }
    setPatterns([...patterns, newPattern.trim()]);
    setNewPattern("");
    toast.success("Pattern added successfully");
  };

  const removePattern = (pattern: string) => {
    setPatterns(patterns.filter((p) => p !== pattern));
    toast.success("Pattern removed successfully");
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("API key cannot be empty");
      return;
    }
    toast.success("API key saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new vendor"
                value={newVendor}
                onChange={(e) => setNewVendor(e.target.value)}
              />
              <Button onClick={addVendor} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {vendors.map((vendor, index) => (
                <div
                  key={index}
                  className="flex items-center bg-muted rounded-md px-3 py-1"
                >
                  <span className="text-sm mr-2">{vendor}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeVendor(vendor)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyst Report Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new pattern"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
              />
              <Button onClick={addPattern} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {patterns.map((pattern, index) => (
                <div
                  key={index}
                  className="flex items-center bg-muted rounded-md px-3 py-1"
                >
                  <span className="text-sm mr-2">{pattern}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removePattern(pattern)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Google Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <Button onClick={saveApiKey}>Save API Key</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigForm;
