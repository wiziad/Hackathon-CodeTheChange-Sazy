"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Plus, Minus } from "lucide-react";
import { 
  Card,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  Input,
  MetraLogo,
  HamburgerMenu
} from "@/components/ui/base";
import { useAuth } from '@/providers/auth-provider';

interface Item {
  categoryId: string;
  targetQty: number;
}

export default function NewEvent() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<Item[]>([{ categoryId: "1", targetQty: 1 }]);
  const [timeWindows, setTimeWindows] = useState<string[]>(["today_11_13"]);
  const [sites, setSites] = useState<string[]>(["1"]);
  const [visibility, setVisibility] = useState("public");

  const handleAddItem = () => {
    setItems([...items, { categoryId: "1", targetQty: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddTimeWindow = () => {
    setTimeWindows([...timeWindows, "today_13_15"]);
  };

  const handleRemoveTimeWindow = (index: number) => {
    if (timeWindows.length > 1) {
      const newTimeWindows = [...timeWindows];
      newTimeWindows.splice(index, 1);
      setTimeWindows(newTimeWindows);
    }
  };

  const handleTimeWindowChange = (index: number, value: string) => {
    const newTimeWindows = [...timeWindows];
    newTimeWindows[index] = value;
    setTimeWindows(newTimeWindows);
  };

  const handleAddSite = () => {
    setSites([...sites, "2"]);
  };

  const handleRemoveSite = (index: number) => {
    if (sites.length > 1) {
      const newSites = [...sites];
      newSites.splice(index, 1);
      setSites(newSites);
    }
  };

  const handleSiteChange = (index: number, value: string) => {
    const newSites = [...sites];
    newSites[index] = value;
    setSites(newSites);
  };

  const handlePublish = async () => {
    try {
      if (!user?.id) {
        localStorage.setItem('metra_return_to', '/donor/event/new');
        router.push('/auth');
        return;
      }

      // Store locally first to ensure it persists
      const newEvent = {
        id: String(Date.now()),
        title,
        description,
        status: 'open',
        createdAt: new Date().toISOString(),
        items: items.map(it => String(it.categoryId)),
        rsvpCount: 0
      };

      try {
        const ls = JSON.parse(localStorage.getItem('metra_events') || '[]');
        ls.push(newEvent);
        localStorage.setItem('metra_events', JSON.stringify(ls));
      } catch (e) {
        localStorage.setItem('metra_events', JSON.stringify([newEvent]));
      }

      // Try backend API (will fail gracefully if not ready)
      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            creator_id: user.id,
            capacity: null,
            items,
            timeOptions: timeWindows,
            siteOptions: sites,
            visibility,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Event created on backend:', data);
        }
      } catch (apiError) {
        console.log('Backend not ready, using local storage only');
      }

      router.push('/donor/my-events');
    } catch (e) {
      console.error('Publish error:', e);
      router.push('/donor/my-events');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              onClick={() => router.back()}
            >
              ←
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <MetraLogo />
            </button>
          </div>
          <HamburgerMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        <div className="container max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Set up your food donation event</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  className={`h-2 w-2 rounded-full ${step >= num ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"}`}
                />
              ))}
            </div>
          </div>

          <Card>
            <div className="p-6">
              <div className="space-y-1 mb-4">
                <h2 className="text-lg font-semibold">
                  {step === 1 && "Event Basics"}
                  {step === 2 && "Time Options"}
                  {step === 3 && "Site Options"}
                  {step === 4 && "Visibility"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {step === 1 && "Basic information about your event"}
                  {step === 2 && "Select time windows for your event"}
                  {step === 3 && "Select sites for your event"}
                  {step === 4 && "Set who can see your event"}
                </p>
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Event Title</label>
                    <Input
                      id="title"
                      placeholder="e.g., Weekend Food Drive"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                      id="description"
                      placeholder="Describe your event..."
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Items Needed</label>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <select
                            className="flex h-10 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 flex-1"
                            value={item.categoryId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleItemChange(index, "categoryId", e.target.value)}
                          >
                            <option value="1">Fresh Produce</option>
                            <option value="2">Canned Goods</option>
                            <option value="3">Bakery</option>
                            <option value="4">Dairy</option>
                            <option value="5">Meat</option>
                          </select>
                          <Input
                            type="number"
                            min="1"
                            value={item.targetQty}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, "targetQty", e.target.value)}
                            className="w-24"
                          />
                          <OutlineButton 
                            onClick={() => handleRemoveItem(index)}
                            disabled={items.length <= 1}
                            className="p-2"
                          >
                            <Minus className="h-4 w-4" />
                          </OutlineButton>
                        </div>
                      ))}
                      <OutlineButton 
                        onClick={handleAddItem}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </OutlineButton>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Time Windows</label>
                  <div className="space-y-3">
                    {timeWindows.map((timeWindow, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          className="flex h-10 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 flex-1"
                          value={timeWindow}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTimeWindowChange(index, e.target.value)}
                        >
                          <option value="today_09_11">Today 9:00-11:00</option>
                          <option value="today_11_13">Today 11:00-13:00</option>
                          <option value="today_13_15">Today 13:00-15:00</option>
                          <option value="today_15_17">Today 15:00-17:00</option>
                          <option value="today_17_19">Today 17:00-19:00</option>
                          <option value="tomorrow_09_11">Tomorrow 9:00-11:00</option>
                          <option value="tomorrow_11_13">Tomorrow 11:00-13:00</option>
                          <option value="tomorrow_13_15">Tomorrow 13:00-15:00</option>
                          <option value="tomorrow_15_17">Tomorrow 15:00-17:00</option>
                          <option value="tomorrow_17_19">Tomorrow 17:00-19:00</option>
                        </select>
                        <OutlineButton 
                          onClick={() => handleRemoveTimeWindow(index)}
                          disabled={timeWindows.length <= 1}
                          className="p-2"
                        >
                          <Minus className="h-4 w-4" />
                        </OutlineButton>
                      </div>
                    ))}
                    <OutlineButton 
                      onClick={handleAddTimeWindow}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time Window
                    </OutlineButton>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Sites</label>
                  <div className="space-y-3">
                    {sites.map((site, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          className="flex h-10 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 flex-1"
                          value={site}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSiteChange(index, e.target.value)}
                        >
                          <option value="1">Community Center</option>
                          <option value="2">City Park Pavilion</option>
                          <option value="3">Library Meeting Room</option>
                        </select>
                        <OutlineButton 
                          onClick={() => handleRemoveSite(index)}
                          disabled={sites.length <= 1}
                          className="p-2"
                        >
                          <Minus className="h-4 w-4" />
                        </OutlineButton>
                      </div>
                    ))}
                    <OutlineButton 
                      onClick={handleAddSite}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Site
                    </OutlineButton>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Visibility</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="public"
                        name="visibility"
                        value="public"
                        checked={visibility === "public"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="public" className="text-sm">Public - Anyone can see this event</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="followers"
                        name="visibility"
                        value="followers"
                        checked={visibility === "followers"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="followers" className="text-sm">Followers - Only your followers can see this event</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="invite"
                        name="visibility"
                        value="invite"
                        checked={visibility === "invite"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="invite" className="text-sm">Invite Only - Only people you invite can see this event</label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between pt-6">
                <SecondaryButton 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Back
                </SecondaryButton>
                {step < 4 ? (
                  <PrimaryButton onClick={() => setStep(step + 1)}>
                    Next
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={handlePublish}>
                    Publish Event
                  </PrimaryButton>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}