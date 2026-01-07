
import React, { useState, useEffect } from 'react';
import { AIModel } from '@/types';
import { AVAILABLE_MODELS, selectModel, getCurrentModel, getCurrentSubModel } from '@/utils/modelUtils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings, Volume2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import useTTSSetting from '@/hooks/useTTSSetting';
import { UserButton } from '@clerk/clerk-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header: React.FC = () => {
  const [activeModel, setActiveModel] = useState<AIModel>(getCurrentModel());
  const [activeSubModel, setActiveSubModel] = useState<string | null>(getCurrentSubModel());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [ttsEnabled, setTtsEnabled] = useTTSSetting();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModelSelect = (modelId: AIModel) => {
    setActiveModel(modelId);
    selectModel(modelId);

    // Reset sub-model when model changes
    const newModel = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (newModel?.subModels && newModel.subModels.length > 0) {
      setActiveSubModel(newModel.subModels[0].id);
    }
  };

  const handleSubModelSelect = (subModelId: string) => {
    setActiveSubModel(subModelId);
    selectModel(activeModel, subModelId);
  };

  return (
    <header className="w-full glass sticky top-0 z-50 py-4 shadow-lg animate-slide-down">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex md:ml-[280px] items-center gap-4 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <div className="relative bg-gradient-primary p-2.5 rounded-xl shadow-lg">
                  <UserButton/>
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-0.5">
                  <span className="gradient-text">Tack</span>
                  <span className="gradient-text">Insight</span>
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm font-medium">
                  AI-Powered Accessibility
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 glass-card">
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    <span>Settings</span>
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card">
                  <DropdownMenuLabel>AI Model</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {AVAILABLE_MODELS.map((model) => (
                    <DropdownMenuSub key={model.id}>
                      <DropdownMenuSubTrigger
                        className={activeModel === model.id ? "bg-accent" : ""}
                      >
                        {model.name}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="glass-card">
                        <DropdownMenuRadioGroup
                          value={activeModel === model.id ? activeSubModel || "" : ""}
                          onValueChange={handleSubModelSelect}
                        >
                          {model.subModels?.map((subModel) => (
                            <DropdownMenuRadioItem
                              key={subModel.id}
                              value={subModel.id}
                              className="cursor-pointer"
                              onClick={() => {
                                if (activeModel !== model.id) {
                                  handleModelSelect(model.id);
                                }
                              }}
                            >
                              {subModel.name}
                              <span className="ml-2 text-xs text-muted-foreground">
                                {subModel.description.substring(0, 20)}...
                              </span>
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="flex items-center justify-between px-2 py-2">
                    <label htmlFor="tts-toggle-mobile" className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Text-to-Speech
                    </label>
                    <Switch
                      id="tts-toggle-mobile"
                      checked={ttsEnabled}
                      onCheckedChange={(v) => setTtsEnabled(!!v)}
                      aria-checked={ttsEnabled}
                      aria-label="Toggle text to speech"
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                {/* AI Model Selection */}
                <div className="flex flex-col items-end gap-2">
                  <div
                    role="radiogroup"
                    aria-labelledby="model-selection"
                    className="flex flex-wrap gap-2"
                  >
                    <span id="model-selection" className="sr-only">Select AI model</span>

                    <ToggleGroup
                      type="single"
                      value={activeModel}
                      onValueChange={(value) => value && handleModelSelect(value as AIModel)}
                      className="bg-muted/50 p-1 rounded-lg"
                    >
                      {AVAILABLE_MODELS.map((model) => (
                        <ToggleGroupItem
                          key={model.id}
                          value={model.id}
                          aria-checked={activeModel === model.id}
                          aria-label={`Use ${model.name} model: ${model.description}`}
                          className="transition-all duration-300 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {model.name}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>

                  {activeModel && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2 hover:bg-accent">
                          {AVAILABLE_MODELS.find(m => m.id === activeModel)?.subModels?.find(s => s.id === activeSubModel)?.name || "Select variant"}
                          <ChevronDown className="h-3 w-3 ml-1" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 glass-card">
                        <DropdownMenuLabel>Model Variant</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={activeSubModel || ""}
                          onValueChange={handleSubModelSelect}
                        >
                          {AVAILABLE_MODELS.find(m => m.id === activeModel)?.subModels?.map((subModel) => (
                            <DropdownMenuRadioItem
                              key={subModel.id}
                              value={subModel.id}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{subModel.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {subModel.description}
                                </span>
                              </div>
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* TTS Toggle */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="tts-toggle" className="text-xs font-medium text-muted-foreground">TTS</label>
                  <Switch
                    id="tts-toggle"
                    checked={ttsEnabled}
                    onCheckedChange={(v) => setTtsEnabled(!!v)}
                    aria-checked={ttsEnabled}
                    aria-label="Toggle text to speech"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
