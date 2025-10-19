package com.aurora.reading.core.models

/**
 * Game Result Data Class
 *
 * Represents the results of a completed Letter Pop game round.
 *
 * Used to pass performance data from LetterPopScreen to ResultsScreen.
 *
 * Responsibilities:
 * - Store game performance data (score, time, settings)
 * - Calculate derived metrics (accuracy, star rating)
 * - Provide celebration message based on performance
 * - Calculate average time per question
 */
data class GameResult(
    /**
     * Number of correct answers (0-10)
     */
    val score: Int,

    /**
     * Total number of questions in the round (always 10 for Letter Pop)
     */
    val totalQuestions: Int = 10,

    /**
     * Time limit per letter in seconds (from settings)
     */
    val timeLimit: Float,

    /**
     * Total time elapsed for all questions in seconds
     */
    val totalTimeElapsed: Float,

    /**
     * Letter case mode: "uppercase", "lowercase", or "mixed"
     */
    val letterCase: String
) {
    /**
     * Calculate accuracy percentage (0-100)
     */
    fun getAccuracy(): Float {
        return (score.toFloat() / totalQuestions.toFloat()) * 100f
    }

    /**
     * Calculate star rating (1-3 stars)
     * - 8-10 correct: 3 stars (80-100%)
     * - 5-7 correct: 2 stars (50-79%)
     * - 0-4 correct: 1 star (0-49%)
     *
     * Note: ADHD-friendly - always awards at least 1 star (never 0)
     */
    fun getStarRating(): Int {
        val percentage = getAccuracy()

        return when {
            percentage >= 80f -> 3
            percentage >= 50f -> 2
            else -> 1 // Always at least 1 star (ADHD-friendly, non-punitive)
        }
    }

    /**
     * Get celebration message based on performance
     * - 3 stars: "EXCELLENT!"
     * - 2 stars: "GOOD JOB!"
     * - 1 star: "KEEP TRYING!"
     */
    fun getCelebrationMessage(): String {
        return when (getStarRating()) {
            3 -> "EXCELLENT!"
            2 -> "GOOD JOB!"
            else -> "KEEP TRYING!"
        }
    }

    /**
     * Get average time per question
     */
    fun getAverageTimePerQuestion(): Float {
        return totalTimeElapsed / totalQuestions.toFloat()
    }
}
