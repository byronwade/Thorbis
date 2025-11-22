# Email Spam Filter System

## Overview

The Stratos communication system includes an intelligent spam filtering system that uses a hybrid approach combining AI-powered detection (Anthropic Claude) with rule-based filtering for optimal performance and accuracy.

## Architecture

The spam filter uses a **two-tier approach**:

1. **Rule-Based Filter (Fast)**: Quick pattern matching for obvious spam indicators
2. **AI-Powered Filter (Accurate)**: Anthropic Claude AI for nuanced spam detection

### How It Works

```
Inbound Email → Rule-Based Check → AI Check (if needed) → Spam Classification
```

1. **First Pass**: Rule-based filter checks for obvious spam patterns (no API calls, instant)
2. **Second Pass**: If rules are uncertain, AI analyzes the email content
3. **Result**: Email is marked as spam with confidence score and reason

## Features

- ✅ **Hybrid Detection**: Combines fast rules with accurate AI
- ✅ **Confidence Scoring**: Provides 0-100 spam score with confidence levels
- ✅ **Automatic Classification**: Emails automatically categorized as spam
- ✅ **Detailed Reasoning**: Explains why an email was marked as spam
- ✅ **Fallback System**: Works even without AI API key (rules-only mode)
- ✅ **Performance Optimized**: Rules run first, AI only for uncertain cases

## Configuration

### Environment Variables

```bash
# Required for AI-powered spam detection
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Configure AI provider
AI_PROVIDER=anthropic  # openai | anthropic | google
```

### Spam Filter Behavior

- **With Anthropic API Key**: Full AI-powered spam detection
- **Without API Key**: Rule-based filtering only (still effective)

## Spam Detection Methods

### Rule-Based Detection

The rule-based filter checks for:

- **Subject Patterns**: 
  - Viagra/pharmacy keywords
  - "Winner", "Congratulations", "You won"
  - "Urgent", "Act now", "Limited time"
  - "Free money", "Get rich", "Make $"
  - "Click here", "Visit now"
  - Nigerian prince/inheritance scams

- **Body Patterns**:
  - Excessive links
  - Suspicious promotional language
  - Loan/credit check offers
  - Guaranteed/risk-free claims

- **Sender Patterns**:
  - No-reply addresses
  - Excessive capitalization
  - Very short or empty content

### AI-Powered Detection

When Anthropic API is available, Claude analyzes:

- Email content and context
- Phishing attempts
- Scam indicators
- Legitimate business communication patterns
- Grammar and formatting quality
- Suspicious link patterns

## Spam Classification

When an email is detected as spam:

1. **Category**: Set to `"spam"` in the `communications` table
2. **Tags**: Added `"spam"` tag for filtering
3. **Metadata**: Spam check results stored in `provider_metadata.spam_check`:
   ```json
   {
     "isSpam": true,
     "confidence": 0.95,
     "reason": "Contains suspicious promotional content",
     "method": "ai",
     "score": 85,
     "checked_at": "2024-01-15T10:30:00Z"
   }
   ```

## Spam Filter Results

### Result Object

```typescript
interface SpamCheckResult {
  isSpam: boolean;           // Whether email is spam
  confidence: number;        // 0-1 confidence level
  reason: string;            // Explanation of decision
  method: "ai" | "rules" | "hybrid";  // Detection method used
  score?: number;            // 0-100 spam score
}
```

### Confidence Levels

- **0.8-1.0**: Very confident (likely spam/not spam)
- **0.6-0.8**: Confident
- **0.4-0.6**: Uncertain (may use AI for verification)
- **0.0-0.4**: Low confidence

## Viewing Spam Emails

Spam emails are automatically:

1. **Categorized**: Appear in the "Spam" folder in the email sidebar
2. **Tagged**: Can be filtered by the "spam" tag
3. **Tracked**: Spam check metadata stored for review

### Accessing Spam Folder

Navigate to: `/dashboard/communication/email?folder=spam`

## Manual Review

If a legitimate email is incorrectly marked as spam:

1. Open the email
2. Click "Not Spam" (if implemented) or manually remove spam tag
3. The system learns from corrections (future enhancement)

## Performance

### Rule-Based Filter
- **Speed**: < 10ms per email
- **API Calls**: 0
- **Cost**: Free

### AI-Powered Filter
- **Speed**: ~500-1000ms per email
- **API Calls**: 1 per uncertain email
- **Cost**: ~$0.0001-0.0003 per email (Claude Haiku)

### Hybrid Approach
- **Average Speed**: ~50-200ms (most emails caught by rules)
- **API Calls**: Only for uncertain cases (~10-20% of emails)
- **Cost**: Minimal (only when needed)

## Customization

### Adjusting Spam Sensitivity

To modify spam detection sensitivity, edit `src/lib/email/spam-filter.ts`:

```typescript
// In ruleBasedSpamCheck function:
// Lower threshold = more sensitive
if (score >= 30) {  // Adjust this threshold
  return { isSpam: true, ... };
}
```

### Custom Rules

Add custom spam patterns in `ruleBasedSpamCheck()`:

```typescript
const customPatterns = [
  /\b(your-custom-pattern)\b/i,
  // Add more patterns
];
```

### AI Prompt Customization

Modify the AI prompt in `aiSpamCheck()` to adjust AI behavior:

```typescript
const prompt = `Your custom spam detection instructions...`;
```

## Monitoring

### Spam Check Logs

Check server logs for spam filter activity:

```
🔍 Running spam filter check...
🚫 Email detected as spam (ai, confidence: 95.0%): Contains suspicious promotional content
✅ Email passed spam filter (rules, confidence: 85.0%)
```

### Database Queries

Query spam emails:

```sql
SELECT * FROM communications 
WHERE category = 'spam' 
ORDER BY created_at DESC;
```

View spam check metadata:

```sql
SELECT 
  id,
  subject,
  from_address,
  provider_metadata->'spam_check' as spam_check
FROM communications
WHERE category = 'spam';
```

## Future Enhancements

Potential improvements:

- [ ] User feedback system (mark as spam/not spam)
- [ ] Machine learning from user corrections
- [ ] Whitelist/blacklist management
- [ ] Per-company spam sensitivity settings
- [ ] Spam statistics dashboard
- [ ] Automatic spam folder cleanup
- [ ] Integration with external spam databases (Spamhaus, etc.)

## Troubleshooting

### Spam Filter Not Working

1. **Check API Key**: Ensure `ANTHROPIC_API_KEY` is set (for AI mode)
2. **Check Logs**: Look for spam filter errors in server logs
3. **Verify Integration**: Confirm spam filter is called in webhook handler

### Too Many False Positives

1. **Adjust Thresholds**: Lower spam score thresholds
2. **Review Rules**: Remove overly aggressive patterns
3. **Whitelist Domains**: Add trusted domains to bypass filter

### Too Many False Negatives

1. **Increase Sensitivity**: Raise spam score thresholds
2. **Add Patterns**: Include more spam indicators in rules
3. **Enable AI**: Ensure Anthropic API key is configured

## API Reference

### `checkSpam(email: EmailContent): Promise<SpamCheckResult>`

Main spam detection function. Uses hybrid approach.

```typescript
const result = await checkSpam({
  subject: "Urgent: Claim your prize!",
  body: "Click here to claim...",
  bodyHtml: "<html>...</html>",
  fromAddress: "spammer@example.com",
  fromName: "Spammer",
  toAddress: "user@example.com",
});
```

### `quickSpamCheck(email: EmailContent): SpamCheckResult`

Fast rule-based check only (no AI). Use for high-volume scenarios.

```typescript
const result = quickSpamCheck({
  subject: "Test",
  body: "Test email",
  // ...
});
```

## Support

For issues or questions about the spam filter:

1. Check server logs for spam filter errors
2. Review spam check metadata in database
3. Test with sample spam emails
4. Adjust sensitivity settings as needed

