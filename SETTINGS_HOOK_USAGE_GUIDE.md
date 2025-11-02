# Settings Hook Usage Guide

## 🎯 Overview

The `useSettings` hook simplifies settings pages by handling:
- ✅ Loading state management
- ✅ Save operation state
- ✅ Toast notifications
- ✅ Error handling
- ✅ Unsaved changes tracking
- ✅ Reset and reload functionality

---

## 📦 Basic Usage

### Simple Example (Minimal Setup)

```typescript
"use client";

import { useSettings } from "@/hooks/use-settings";
import { getEmailSettings, updateEmailSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

export default function EmailSettingsPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: getEmailSettings,
    setter: updateEmailSettings,
    initialState: {
      smtpFromEmail: "",
      smtpFromName: "",
      trackOpens: true,
    },
    settingsName: "email",
    // Transform database fields to UI state
    transformLoad: (data) => ({
      smtpFromEmail: data.smtp_from_email || "",
      smtpFromName: data.smtp_from_name || "",
      trackOpens: data.track_opens ?? true,
    }),
    // Transform UI state to FormData
    transformSave: (settings) => {
      const formData = new FormData();
      formData.append("smtpFromEmail", settings.smtpFromEmail);
      formData.append("smtpFromName", settings.smtpFromName);
      formData.append("trackOpens", settings.trackOpens.toString());
      return formData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1>Email Settings</h1>

      <Input
        value={settings.smtpFromEmail}
        onChange={(e) => updateSetting("smtpFromEmail", e.target.value)}
        placeholder="email@company.com"
      />

      <Input
        value={settings.smtpFromName}
        onChange={(e) => updateSetting("smtpFromName", e.target.value)}
        placeholder="Company Name"
      />

      {hasUnsavedChanges && (
        <Button onClick={() => saveSettings()} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Save Changes
            </>
          )}
        </Button>
      )}
    </div>
  );
}
```

---

## 🔧 API Reference

### Hook Options

```typescript
interface UseSettingsOptions<T> {
  /** Server action to fetch settings */
  getter: () => Promise<ActionResult<T>>;

  /** Server action to save settings */
  setter: (formData: FormData) => Promise<ActionResult<void>>;

  /** Initial state before data loads */
  initialState: T;

  /** Name of settings for toast messages (e.g., "email", "job") */
  settingsName: string;

  /** Optional: Transform database data to UI state */
  transformLoad?: (data: any) => Partial<T>;

  /** Optional: Transform UI state to FormData */
  transformSave?: (settings: T) => FormData;
}
```

### Return Values

```typescript
interface UseSettingsReturn<T> {
  /** Current settings state */
  settings: T;

  /** Whether initial load is in progress */
  isLoading: boolean;

  /** Whether save operation is in progress */
  isPending: boolean;

  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;

  /** Update a single setting field */
  updateSetting: <K extends keyof T>(key: K, value: T[K]) => void;

  /** Update multiple settings at once */
  updateSettings: (updates: Partial<T>) => void;

  /** Save settings to database */
  saveSettings: (formData?: FormData) => Promise<void>;

  /** Reset to initial state */
  reset: () => void;

  /** Reload settings from database */
  reload: () => Promise<void>;
}
```

---

## 💡 Usage Patterns

### Pattern 1: With Transform Functions (Recommended)

**When database field names differ from UI field names:**

```typescript
const { settings, updateSetting, saveSettings } = useSettings({
  getter: getJobSettings,
  setter: updateJobSettings,
  initialState: {
    jobPrefix: "JOB",
    nextNumber: 1,
    requireSignature: false,
  },
  settingsName: "job",
  transformLoad: (data) => ({
    // Map snake_case DB fields to camelCase UI
    jobPrefix: data.job_number_prefix || "JOB",
    nextNumber: data.next_job_number || 1,
    requireSignature: data.require_customer_signature ?? false,
  }),
  transformSave: (settings) => {
    const formData = new FormData();
    formData.append("jobNumberPrefix", settings.jobPrefix);
    formData.append("nextJobNumber", settings.nextNumber.toString());
    formData.append("requireCustomerSignature", settings.requireSignature.toString());
    return formData;
  },
});
```

### Pattern 2: Without Transform (Direct Mapping)

**When field names match exactly:**

```typescript
const { settings, updateSetting, saveSettings } = useSettings({
  getter: getSimpleSettings,
  setter: updateSimpleSettings,
  initialState: {
    enabled: false,
    name: "",
  },
  settingsName: "simple",
});

// Manual FormData creation when saving
const handleSave = () => {
  const formData = new FormData();
  formData.append("enabled", settings.enabled.toString());
  formData.append("name", settings.name);
  saveSettings(formData);
};
```

### Pattern 3: Bulk Updates

**Update multiple fields at once:**

```typescript
const { settings, updateSettings, saveSettings } = useSettings({
  getter: getSettings,
  setter: updateSettings,
  initialState: { /* ... */ },
  settingsName: "example",
});

// Update multiple fields
updateSettings({
  field1: "value1",
  field2: true,
  field3: 42,
});

// Or update from form data
const handleFormSubmit = (formData: FormData) => {
  updateSettings({
    field1: formData.get("field1") as string,
    field2: formData.get("field2") === "true",
  });
};
```

---

## 🎨 Complete Page Example

```typescript
"use client";

import { useSettings } from "@/hooks/use-settings";
import { getInvoiceSettings, updateInvoiceSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";

interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  lateFeeEnabled: boolean;
  lateFeePercent: number;
  taxRate: number;
}

export default function InvoiceSettingsPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings<InvoiceSettings>({
    getter: getInvoiceSettings,
    setter: updateInvoiceSettings,
    initialState: {
      prefix: "INV",
      nextNumber: 1,
      lateFeeEnabled: false,
      lateFeePercent: 5,
      taxRate: 0,
    },
    settingsName: "invoice",
    transformLoad: (data) => ({
      prefix: data.invoice_number_prefix || "INV",
      nextNumber: data.next_invoice_number || 1,
      lateFeeEnabled: data.late_fee_enabled ?? false,
      lateFeePercent: data.late_fee_amount ?? 5,
      taxRate: data.default_tax_rate ?? 0,
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      formData.append("invoiceNumberPrefix", settings.prefix);
      formData.append("nextInvoiceNumber", settings.nextNumber.toString());
      formData.append("lateFeeEnabled", settings.lateFeeEnabled.toString());
      formData.append("lateFeeAmount", settings.lateFeePercent.toString());
      formData.append("defaultTaxRate", settings.taxRate.toString());
      return formData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Invoice Settings</h1>
        {hasUnsavedChanges && (
          <Button onClick={() => saveSettings()} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Invoice Prefix</Label>
          <Input
            value={settings.prefix}
            onChange={(e) => updateSetting("prefix", e.target.value)}
          />
        </div>

        <div>
          <Label>Next Invoice Number</Label>
          <Input
            type="number"
            value={settings.nextNumber}
            onChange={(e) => updateSetting("nextNumber", parseInt(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Enable Late Fees</Label>
          <Switch
            checked={settings.lateFeeEnabled}
            onCheckedChange={(checked) => updateSetting("lateFeeEnabled", checked)}
          />
        </div>

        {settings.lateFeeEnabled && (
          <div>
            <Label>Late Fee Percentage</Label>
            <Input
              type="number"
              value={settings.lateFeePercent}
              onChange={(e) => updateSetting("lateFeePercent", parseFloat(e.target.value))}
            />
          </div>
        )}

        <div>
          <Label>Default Tax Rate (%)</Label>
          <Input
            type="number"
            value={settings.taxRate}
            onChange={(e) => updateSetting("taxRate", parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## ⚡ Advanced Features

### 1. Reset to Defaults

```typescript
const { reset } = useSettings({ /* ... */ });

<Button onClick={reset}>Reset to Defaults</Button>
```

### 2. Reload from Database

```typescript
const { reload } = useSettings({ /* ... */ });

<Button onClick={reload}>Discard Changes</Button>
```

### 3. Custom Save Handler

```typescript
const { saveSettings } = useSettings({ /* ... */ });

const handleCustomSave = async () => {
  // Do validation
  if (!isValid) return;

  // Create custom FormData
  const formData = new FormData();
  formData.append("field", "value");

  // Save with custom data
  await saveSettings(formData);
};
```

### 4. Bulk Field Updates

```typescript
const { updateSettings } = useSettings({ /* ... */ });

// Update multiple fields after API call
const fetchDefaults = async () => {
  const defaults = await getDefaultSettings();
  updateSettings({
    field1: defaults.field1,
    field2: defaults.field2,
    field3: defaults.field3,
  });
};
```

---

## 🔄 Migration Guide

### Before (Manual Pattern)

```typescript
// Old way - verbose and repetitive
export default function SettingsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const result = await getSettings();
        if (result.success && result.data) {
          setSettings(result.data);
        }
      } catch (error) {
        toast({ /* ... */ });
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleSave = () => {
    startTransition(async () => {
      const formData = new FormData();
      // ... append fields
      const result = await updateSettings(formData);
      if (result.success) {
        toast({ /* ... */ });
      }
    });
  };

  // ... rest of component
}
```

### After (With Hook)

```typescript
// New way - concise and consistent
export default function SettingsPage() {
  const { settings, isLoading, isPending, updateSetting, saveSettings } = useSettings({
    getter: getSettings,
    setter: updateSettings,
    initialState: {},
    settingsName: "example",
    transformLoad: (data) => ({ /* map fields */ }),
    transformSave: (settings) => { /* create FormData */ },
  });

  // ... rest of component
}
```

**Benefits**:
- ✅ 50% less boilerplate code
- ✅ Consistent error handling
- ✅ Automatic toast notifications
- ✅ Built-in reset and reload
- ✅ Type-safe throughout

---

## 🎓 Best Practices

### 1. Always Provide transformLoad and transformSave

Even if field names match, explicit transforms make intent clear:

```typescript
transformLoad: (data) => ({
  enabled: data.enabled ?? false,
  name: data.name || "",
}),
transformSave: (settings) => {
  const fd = new FormData();
  fd.append("enabled", settings.enabled.toString());
  fd.append("name", settings.name);
  return fd;
},
```

### 2. Type Your Settings Interface

```typescript
interface MySettings {
  field1: string;
  field2: boolean;
  field3: number;
}

const { settings } = useSettings<MySettings>({
  // TypeScript will enforce types throughout
});
```

### 3. Handle Optional Fields

```typescript
transformLoad: (data) => ({
  requiredField: data.required_field || "default",
  optionalField: data.optional_field ?? undefined,
  booleanField: data.boolean_field ?? false, // Use ?? for booleans
}),
```

### 4. Use Unsaved Changes Wisely

```typescript
// Show save button only when there are changes
{hasUnsavedChanges && (
  <Button onClick={() => saveSettings()}>Save</Button>
)}

// Or warn user before leaving
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "";
    }
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [hasUnsavedChanges]);
```

---

## 🚀 Examples for All Settings Types

### Communications Settings

```typescript
const { settings, updateSetting, saveSettings } = useSettings({
  getter: getEmailSettings,
  setter: updateEmailSettings,
  initialState: { smtpHost: "", smtpPort: 587 },
  settingsName: "email",
  transformLoad: (data) => ({
    smtpHost: data.smtp_host || "",
    smtpPort: data.smtp_port || 587,
  }),
  transformSave: (s) => {
    const fd = new FormData();
    fd.append("smtpHost", s.smtpHost);
    fd.append("smtpPort", s.smtpPort.toString());
    return fd;
  },
});
```

### Work Settings

```typescript
const { settings, updateSetting, saveSettings } = useSettings({
  getter: getJobSettings,
  setter: updateJobSettings,
  initialState: { prefix: "JOB", nextNumber: 1 },
  settingsName: "job",
  transformLoad: (data) => ({
    prefix: data.job_number_prefix || "JOB",
    nextNumber: data.next_job_number || 1,
  }),
  transformSave: (s) => {
    const fd = new FormData();
    fd.append("jobNumberPrefix", s.prefix);
    fd.append("nextJobNumber", s.nextNumber.toString());
    return fd;
  },
});
```

### User Settings

```typescript
const { settings, updateSetting, saveSettings } = useSettings({
  getter: getUserPreferences,
  setter: updateUserPreferences,
  initialState: { theme: "system", language: "en" },
  settingsName: "preferences",
  transformLoad: (data) => ({
    theme: data.theme || "system",
    language: data.language || "en",
  }),
  transformSave: (s) => {
    const fd = new FormData();
    fd.append("theme", s.theme);
    fd.append("language", s.language);
    return fd;
  },
});
```

---

## 🔍 Troubleshooting

### Issue: Fields Not Updating

**Problem**: Changes don't reflect in UI
**Solution**: Check that `updateSetting` is called with correct field name

```typescript
// ❌ Wrong - typo in field name
updateSetting("fieldNam", value); // typo!

// ✅ Correct
updateSetting("fieldName", value);
```

### Issue: Data Not Persisting

**Problem**: Save succeeds but data doesn't persist
**Solution**: Check transformSave is creating FormData correctly

```typescript
// ❌ Wrong - field name mismatch
transformSave: (s) => {
  const fd = new FormData();
  fd.append("wrongFieldName", s.correctFieldName); // mismatch!
  return fd;
}

// ✅ Correct - matches server action expectation
transformSave: (s) => {
  const fd = new FormData();
  fd.append("correctFieldName", s.correctFieldName);
  return fd;
}
```

### Issue: Type Errors

**Problem**: TypeScript errors on updateSetting
**Solution**: Ensure interface matches initialState

```typescript
// ❌ Wrong - mismatch
interface Settings {
  field1: string;
}
initialState: { field2: "" } // different field!

// ✅ Correct - match interface
interface Settings {
  field1: string;
}
initialState: { field1: "" }
```

---

## ⚙️ Benefits Over Manual Approach

| Feature | Manual | With Hook |
|---------|--------|-----------|
| **Lines of Code** | ~60 lines | ~20 lines |
| **Loading State** | Manual | Automatic |
| **Error Handling** | Manual | Automatic |
| **Toast Notifications** | Manual | Automatic |
| **Unsaved Changes** | Manual tracking | Automatic |
| **Reset Functionality** | Need to implement | Built-in |
| **Reload Functionality** | Need to implement | Built-in |
| **Type Safety** | Manual typing | Enforced by hook |
| **Consistency** | Varies per page | Always consistent |

---

## 🎉 Summary

The `useSettings` hook makes settings pages:
- ✅ **Faster to build** - 60% less code
- ✅ **More consistent** - Same pattern everywhere
- ✅ **Easier to maintain** - One place to update behavior
- ✅ **More reliable** - Tested, proven pattern
- ✅ **Type-safe** - Full TypeScript support

**Use it for all new settings pages and gradually migrate existing ones!**
