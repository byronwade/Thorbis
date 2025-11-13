# Debug Drag & Drop Column Reordering

## 🔍 Testing Steps

### 1. Open Browser Console
Open your browser's developer console (F12) before testing.

### 2. Navigate to a Table
Go to any table, for example:
- `/dashboard/work/invoices`
- `/dashboard/work/jobs`
- `/dashboard/customers`

### 3. Test Drag
1. **Hover** over a column header
   - ✅ Cursor should change to `grab` hand
   - If not → DndKit listeners aren't attached

2. **Click and hold** for 1 second, then **drag** at least 10px
   - ✅ Should see console log: `🚀 Drag started: [column-key]`
   - ✅ Column should become semi-transparent
   - If not → Sensors aren't detecting movement

3. **Drop** the column
   - ✅ Should see console logs:
     ```
     🔄 Drag ended: { activeId: "...", overId: "...", entity: "..." }
     📍 Reordering: { oldIndex: X, newIndex: Y, currentOrder: [...] }
     ✅ New order: [...]
     ```
   - If not → handleDragEnd isn't firing

## 🐛 Common Issues & Fixes

### Issue 1: Cursor doesn't change to hand
**Problem:** DndKit listeners not attached  
**Check:**
```javascript
// In console, check if entity is set:
// Should see the table component in React DevTools with entity prop
```
**Fix:** Make sure table has `entity="tablename"` prop

### Issue 2: Drag starts but column doesn't move visually
**Problem:** CSS transform not applying  
**Check:** Inspect the column header element - should have inline `style` with `transform`  
**Fix:** Check if `style={style}` is on the correct div

### Issue 3: No console logs at all
**Problem:** DndContext not wrapping columns or `isClient` is false  
**Check:**
```javascript
// In console:
document.querySelector('[role="button"][tabindex="0"]')
// Should return the column header element
```
**Fix:** Wait a moment after page load (for `isClient` to become `true`)

### Issue 4: Drag logs appear but order doesn't change
**Problem:** Store not updating or component not re-rendering  
**Check:**
```javascript
// In console:
localStorage.getItem('datatable-columns-storage')
// Should show the stored column order
```
**Fix:** Clear localStorage and reload: `localStorage.clear()`

### Issue 5: Error in console
**Problem:** Something is breaking the drag  
**Action:** Share the error message

## 🧪 Manual Test

If drag still doesn't work, try this in console:

```javascript
// Get the first sortable column header
const header = document.querySelector('[role="button"][tabindex="0"]');

// Check if it has the listeners
console.log('Header element:', header);
console.log('Has cursor-grab class:', header.classList.contains('cursor-grab'));

// Check DndContext
const dndContext = document.querySelector('[data-dnd-context]');
console.log('DndContext found:', !!dndContext);
```

## 📋 Checklist

When you try to drag, check these in order:

- [ ] Browser console is open
- [ ] Navigated to a table page
- [ ] Table has data (not empty)
- [ ] `isClient` is `true` (wait 1 second after load)
- [ ] Column header cursor is `grab` on hover
- [ ] Held mouse button down for 1+ second
- [ ] Moved mouse at least 10px while holding
- [ ] See `🚀 Drag started` in console
- [ ] Column becomes semi-transparent while dragging
- [ ] See `🔄 Drag ended` in console when dropped
- [ ] See `✅ New order` in console
- [ ] Column position changes visually

## 🆘 If Still Not Working

Please share:
1. Which table you're testing on
2. Console logs (all of them)
3. Any errors in console
4. Screenshot of the Network tab showing the page loaded
5. Browser and OS (Chrome/Firefox/Safari, Mac/Windows)

## 🧹 Clean Slate Test

If nothing works, try this:

```bash
# In terminal:
rm -rf .next
rm -rf node_modules/.cache
pnpm dev
```

Then in browser:
```javascript
// In console:
localStorage.clear();
location.reload();
```

Then try dragging again and share all console output.

