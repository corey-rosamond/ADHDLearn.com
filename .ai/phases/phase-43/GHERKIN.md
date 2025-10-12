# Phase 43: Parent Dashboard - BDD Scenarios

## Feature: Parent Dashboard

```gherkin
Feature: Parent Dashboard
  As a parent
  I want to view my child's learning progress
  So that I can track their development and celebrate their achievements

Background:
  Given the game has been played multiple times
  And progress data exists in LocalStorage
  And I am on the main menu
```

## Scenario: View Dashboard from Main Menu

```gherkin
Scenario: Navigate to dashboard
  Given I am on the main menu
  When I click the "View Progress" button
  Then the DashboardScene should load
  And the page title should say "Parent Dashboard"
  And the subtitle should say "Aurora's Learning Progress"
  And all dashboard sections should be visible
  And no console errors should appear
```

## Scenario: Display Summary Statistics

```gherkin
Scenario: View summary stats with existing progress
  Given I have mastered 18 letters
  And I have learned 42 sight words
  And I have completed 15 play sessions
  And I have played for a total of 2 hours and 30 minutes
  When I open the dashboard
  Then the summary section should display:
    | Metric             | Value      |
    | Letters Mastered   | 18/26      |
    | Sight Words        | 42/100     |
    | Total Sessions     | 15         |
    | Time Played        | 2h 30m     |
  And each stat should be clearly labeled
  And each value should be prominently displayed
```

## Scenario: Display Letter Progress Grid

```gherkin
Scenario: View letters mastered
  Given I have mastered letters A, B, C, D, E, M, S, T
  And I have not practiced letters F-L, N-R, U-Z
  When I view the letters section
  Then all 26 letters should be displayed in a grid
  And letters A, B, C, D, E, M, S, T should be green
  And unpracticed letters should be gray
  And each letter should be in a 50x50 box
  And letters should be arranged in alphabetical order
  And the section title should say "Letters Progress"
```

## Scenario: Display Sight Words Progress

```gherkin
Scenario: View sight words learned
  Given I have learned the words: "the", "and", "is", "to", "of"
  And I have learned 42 total sight words
  When I view the sight words section
  Then the section title should say "Sight Words Learned"
  And it should display "Recent: the, and, is, to, of"
  And the total count "42/100" should be visible in the summary
```

## Scenario: Display Session History

```gherkin
Scenario: View recent play sessions
  Given I have the following session history:
    | Date       | Duration | Score   |
    | Today      | 12m 30s  | 5 stars |
    | Yesterday  | 15m 10s  | 4 stars |
    | Mar 15     | 10m 45s  | 5 stars |
    | Mar 14     | 8m 20s   | 3 stars |
    | Mar 13     | 14m 0s   | 5 stars |
  When I view the session history section
  Then the section title should say "Recent Sessions"
  And the table should have columns: Date, Duration, Score
  And all 5 sessions should be listed
  And dates should be formatted as "Today", "Yesterday", or "Mon DD"
  And durations should be in "Xm Ys" format
  And scores should show star ratings
```

## Scenario: Export Progress Data

```gherkin
Scenario: Export progress to backup file
  Given I am viewing the dashboard
  And I have progress data to export
  When I click the "Export Progress" button
  Then a JSON file should be downloaded
  And the filename should be "aurora-backup-YYYY-MM-DD.json"
  And the file should contain:
    | Field       |
    | version     |
    | exportDate  |
    | letters     |
    | sightWords  |
    | sessions    |
    | settings    |
  And a success message should display "Progress exported successfully!"
  And the message should disappear after 3 seconds
```

## Scenario: Export with No Progress

```gherkin
Scenario: Export empty progress data
  Given I am viewing the dashboard
  And no progress data exists
  When I click the "Export Progress" button
  Then a JSON file should still be downloaded
  And the file should contain empty arrays for letters, sightWords, sessions
  And the version and exportDate should be present
  And a success message should display
```

## Scenario: Import Progress Data

```gherkin
Scenario: Import progress from valid backup file
  Given I am viewing the dashboard
  And I have a valid backup file "aurora-backup-2024-03-15.json"
  When I click the "Import Progress" button
  And I select the backup file
  Then a confirmation dialog should appear
  And the dialog should say "This will replace your current progress. Continue?"
  When I click "OK" to confirm
  Then the progress data should be imported
  And the dashboard should refresh with the imported data
  And a success message should display "Progress imported successfully!"
  And all sections should update with the new data
```

## Scenario: Import Invalid File

```gherkin
Scenario: Attempt to import malformed JSON
  Given I am viewing the dashboard
  And I have a file "invalid.json" with malformed JSON
  When I click the "Import Progress" button
  And I select the invalid file
  Then an error message should display "Error: Invalid backup file"
  And the message should be red/error colored
  And the current progress should not be changed
  And the dashboard should remain in its current state
```

## Scenario: Import with User Cancellation

```gherkin
Scenario: Cancel import operation
  Given I am viewing the dashboard
  And I have a valid backup file
  When I click the "Import Progress" button
  And I select the backup file
  And the confirmation dialog appears
  When I click "Cancel"
  Then the import should be cancelled
  And no data should be changed
  And no success message should appear
  And the dashboard should remain unchanged
```

## Scenario: Calculate Total Time Played

```gherkin
Scenario: Display accurate total playtime
  Given I have sessions with durations:
    | Duration (seconds) |
    | 750  (12m 30s)     |
    | 910  (15m 10s)     |
    | 645  (10m 45s)     |
    | 500  (8m 20s)      |
    | 840  (14m 0s)      |
  When I view the dashboard
  Then the total time should be calculated as 3645 seconds
  And it should display as "1h 0m" or "60m"
  And the calculation should be accurate
```

## Scenario: Format Session Dates

```gherkin
Scenario Outline: Display session dates correctly
  Given a session was played on <sessionDate>
  And today's date is 2024-03-16
  When I view the session history
  Then the date should display as <displayText>

  Examples:
    | sessionDate           | displayText |
    | 2024-03-16 10:00:00  | Today       |
    | 2024-03-15 14:30:00  | Yesterday   |
    | 2024-03-14 09:00:00  | Mar 14      |
    | 2024-03-10 11:45:00  | Mar 10      |
    | 2024-02-28 16:20:00  | Feb 28      |
```

## Scenario: Return to Main Menu

```gherkin
Scenario: Navigate back to main menu
  Given I am viewing the dashboard
  When I click the "Back to Menu" button
  Then the MainMenuScene should load
  And the dashboard should be closed
  And no errors should occur
```

## Scenario: Dashboard with No Data

```gherkin
Scenario: View dashboard with no progress yet
  Given I have never played the game
  And no progress data exists
  When I open the dashboard
  Then the summary should show:
    | Metric             | Value  |
    | Letters Mastered   | 0/26   |
    | Sight Words        | 0/100  |
    | Total Sessions     | 0      |
    | Time Played        | 0m     |
  And all letters should be gray (not mastered)
  And the sight words section should say "No words learned yet"
  And the session history should say "No sessions yet"
  And export/import buttons should still be available
```

## Scenario: Refresh Dashboard After Playing

```gherkin
Scenario: Dashboard updates with new progress
  Given I am viewing the dashboard
  And the dashboard shows 18 letters mastered
  When I return to the main menu
  And I play a session and master letter P
  And I return to the dashboard
  Then the dashboard should reload
  And it should show 19 letters mastered
  And letter P should now be green
  And the new session should appear in the history
```

## Scenario: Display Streak Information

```gherkin
Scenario: Show current and longest play streak
  Given I have played on consecutive days:
    | Date       |
    | Mar 13     |
    | Mar 14     |
    | Mar 15     |
    | Mar 16     |
  And my longest streak ever was 7 days
  And today is Mar 16
  When I view the dashboard
  Then the current streak should display "4 days"
  And the longest streak should display "7 days"
  And both should be clearly labeled
```

## Scenario: Visual Progress Indicators

```gherkin
Scenario: Use color coding for mastery levels
  Given I view the letters section
  When letters are displayed
  Then mastered letters should use color #4CAF50 (green)
  And not-started letters should use color #e0e0e0 (gray)
  And in-progress letters (if tracked) should use color #FFC107 (yellow)
  And colors should be clearly distinguishable
  And colorblind accessibility should be considered
```

## Acceptance Criteria

### Must Have
- [ ] Dashboard scene loads without errors
- [ ] Summary section displays all 4 key metrics correctly
- [ ] Letters section shows all 26 letters with correct mastery status
- [ ] Sight words section shows count and recent words
- [ ] Session history displays last 5+ sessions with formatted data
- [ ] Export button generates valid JSON file
- [ ] Import button loads data from valid JSON file
- [ ] Import validates file format and shows errors for invalid files
- [ ] Back button returns to main menu
- [ ] All data calculations are accurate

### Visual Requirements
- [ ] Clean, professional layout
- [ ] Clear section separation
- [ ] Color coding is intuitive (green = good, gray = not started)
- [ ] Text is readable (appropriate font sizes)
- [ ] Buttons are clearly labeled
- [ ] Success/error messages are visible and timed correctly

### Data Integrity
- [ ] Export includes all necessary data
- [ ] Import preserves data structure
- [ ] No data loss during export/import cycle
- [ ] Invalid imports don't corrupt existing data
- [ ] LocalStorage is updated correctly after import

### User Experience
- [ ] Dashboard loads quickly (< 1 second)
- [ ] Export/import operations feel responsive
- [ ] Success/error messages are clear and helpful
- [ ] Navigation is intuitive
- [ ] No confusing states or error messages

## Edge Cases

```gherkin
Scenario: Handle Corrupted LocalStorage
  Given LocalStorage contains corrupted progress data
  When I open the dashboard
  Then the dashboard should handle the error gracefully
  And it should display an error message or empty state
  And it should not crash the game
  And I should be able to import valid data to recover

Scenario: Export with Special Characters
  Given progress data contains special characters or emoji
  When I export the progress
  Then the JSON should properly escape special characters
  And the exported file should be valid JSON
  And it should import correctly without data loss

Scenario: Import Very Large File
  Given I have a backup file with 1000+ sessions
  When I import the file
  Then the dashboard should show a loading indicator
  And it should complete the import successfully
  Or it should fail gracefully with a helpful message
  And the interface should remain responsive

Scenario: Multiple Rapid Exports
  Given I am on the dashboard
  When I click "Export Progress" 5 times quickly
  Then each export should complete successfully
  And 5 separate files should be downloaded
  And each file should have a unique timestamp
  And no errors should occur

Scenario: Import During Active Session
  Given I have the dashboard open in one tab
  And I am playing the game in another tab
  When I import progress data
  Then the import should complete successfully
  But there may be a warning about potential data conflicts
  And the user should be advised to close other tabs

Scenario: Browser Blocks File Download
  Given my browser blocks automatic downloads
  When I click "Export Progress"
  Then the browser permission dialog should appear
  And if I allow downloads, the export should complete
  And if I deny, an appropriate error message should show
```

## Manual Testing Checklist

### Setup
1. [ ] Ensure game has been played with various progress levels
2. [ ] Verify LocalStorage contains valid data
3. [ ] Have valid and invalid backup files ready for testing
4. [ ] Clear browser console to check for errors

### Dashboard Display
5. [ ] Navigate to dashboard from main menu
6. [ ] Verify all sections render correctly
7. [ ] Check summary stats match actual progress
8. [ ] Verify letter grid shows correct mastery states
9. [ ] Check sight words display correctly
10. [ ] Verify session history shows recent sessions
11. [ ] Confirm all dates are formatted properly
12. [ ] Check total time calculation is accurate

### Export Testing
13. [ ] Click Export Progress button
14. [ ] Verify file downloads successfully
15. [ ] Check filename format is correct (includes date)
16. [ ] Open exported file and verify JSON is valid
17. [ ] Verify all data fields are present
18. [ ] Check success message appears and disappears

### Import Testing
19. [ ] Click Import Progress button
20. [ ] Select valid backup file
21. [ ] Verify confirmation dialog appears
22. [ ] Cancel and verify nothing changes
23. [ ] Import again and confirm to proceed
24. [ ] Verify data loads correctly
25. [ ] Check all sections update with imported data
26. [ ] Verify success message appears

### Error Handling
27. [ ] Try importing invalid JSON file
28. [ ] Verify error message displays
29. [ ] Confirm current data is not affected
30. [ ] Try importing file with wrong structure
31. [ ] Verify validation catches the error

### Navigation
32. [ ] Click Back to Menu button
33. [ ] Verify returns to main menu correctly
34. [ ] Navigate back to dashboard
35. [ ] Verify data persists and displays correctly

### Data Accuracy
36. [ ] Play a new session
37. [ ] Return to dashboard
38. [ ] Verify new session appears in history
39. [ ] Check stats have updated correctly
40. [ ] Verify newly mastered items show correctly

### Cross-browser Testing
41. [ ] Test in Chrome
42. [ ] Test in Firefox
43. [ ] Test in Edge (if available)
44. [ ] Verify export/import works in each browser

### Performance
45. [ ] Check dashboard load time
46. [ ] Verify no lag when scrolling (if scrollable)
47. [ ] Test with large data set (100+ sessions)
48. [ ] Verify charts render smoothly (if implemented)

## Success Criteria

**This phase is complete when:**
1. Dashboard displays all progress data accurately
2. All sections render correctly with proper formatting
3. Export generates valid, complete JSON backups
4. Import successfully restores progress from backups
5. Import validation prevents data corruption
6. Back navigation works smoothly
7. All error states are handled gracefully
8. Success/error messages display correctly
9. No console errors or warnings
10. Dashboard works with empty, partial, and full data states
11. Export/import round-trip preserves all data
12. Performance is acceptable with typical data volumes
13. All acceptance criteria are met
14. Manual testing checklist is complete

## Notes

**Testing Focus Areas**
- Data accuracy is critical - parents need trustworthy information
- Export/import must be bulletproof to prevent progress loss
- Error handling should be friendly and informative
- Performance matters even with large data sets

**Future Enhancements to Consider**
- Filtering session history by date range
- Sorting options (by date, score, duration)
- Detailed per-letter analytics
- Comparison to age-group benchmarks
- Print-friendly view for progress reports
- Share progress via email or social media

**Accessibility Considerations**
- Color coding should not be the only indicator
- Add text labels alongside colors
- Ensure good contrast ratios for all text
- Consider screen reader compatibility
- Test with keyboard-only navigation

This dashboard provides parents with comprehensive insight into their child's learning journey while maintaining data integrity and user-friendly design.
