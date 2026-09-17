import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    // Unmounted / legacy surfaces — not part of the live product path
    'src/pages/DashboardPage.tsx',
    'src/pages/ContributorProfile.tsx',
    'src/components/LiveContributionFeed.tsx',
    'src/components/TrendingSection.tsx',
    'src/components/Leaderboard.tsx',
    'src/components/PersonalizedIssues.tsx',
    'src/components/AchievementBadges.tsx',
    'src/components/ContributionTimeline.tsx',
    'src/components/ImpactMetrics.tsx',
    'src/components/ShareableCard.tsx',
    'src/components/MobileCategoryTabs.tsx',
    'src/components/LoadingProgress.tsx',
    'src/components/FreshnessIndicator.tsx',
    'src/hooks/useContributorProfile.ts',
    'src/hooks/useLiveContributions.ts',
    'src/hooks/useSavedIssues.ts',
    'src/hooks/usePersonalizedIssues.ts',
    'src/utils/contributionTracker.ts',
    'src/utils/issueMatcher.ts',
    'src/utils/languageDetection.ts',
    'src/utils/repoHealth.ts',
    'src/utils/issueFreshness.ts',
    'src/utils/repoLanguages.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/contexts/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
