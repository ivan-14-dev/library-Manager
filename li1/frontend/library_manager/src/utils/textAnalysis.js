// src/utils/textAnalysis.js
export class TextAnalyzer {
  static analyzeReadability(text) {
    const cleanText = text.replace(/<[^>]*>/g, '');
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const characters = cleanText.replace(/\s/g, '').length;

    if (sentences.length === 0 || words.length === 0) {
      return { score: 0, level: 'Indéterminé' };
    }

    // Indice de Flesch-Kincaid (adapté pour le français)
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = this.countSyllables(cleanText) / words.length;
    
    let score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    score = Math.max(0, Math.min(100, score));

    let level = 'Très difficile';
    if (score >= 80) level = 'Très facile';
    else if (score >= 70) level = 'Facile';
    else if (score >= 60) level = 'Assez facile';
    else if (score >= 50) level = 'Standard';
    else if (score >= 30) level = 'Difficile';

    return {
      score: Math.round(score),
      level,
      metrics: {
        sentences: sentences.length,
        words: words.length,
        characters,
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        avgWordLength: Math.round((characters / words.length) * 10) / 10,
        readingTime: Math.ceil(words.length / 200) // 200 mots/minute
      }
    };
  }

  static countSyllables(text) {
    // Approximation pour le français
    const vowels = 'aeiouyàâäéèêëïîôöùûü';
    let count = 0;
    let prevCharVowel = false;

    for (let char of text.toLowerCase()) {
      const isVowel = vowels.includes(char);
      if (isVowel && !prevCharVowel) {
        count++;
      }
      prevCharVowel = isVowel;
    }

    return Math.max(1, count);
  }

  static analyzeVocabulary(text) {
    const words = text.toLowerCase()
      .replace(/<[^>]*>/g, '')
      .split(/\W+/)
      .filter(w => w.length > 2);

    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const uniqueWords = Object.keys(wordFreq);
    const diversity = uniqueWords.length / words.length;

    // Mots complexes (plus de 3 syllabes)
    const complexWords = uniqueWords.filter(word => this.countSyllables(word) > 3);
    const complexityRatio = complexWords.length / words.length;

    return {
      totalWords: words.length,
      uniqueWords: uniqueWords.length,
      vocabularyDiversity: Math.round(diversity * 1000) / 10,
      complexWords: complexWords.length,
      complexityRatio: Math.round(complexityRatio * 1000) / 10,
      mostFrequent: Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))
    };
  }

  static analyzeSentiment(text) {
    // Analyse de sentiment basique
    const positiveWords = ['bon', 'excellent', 'superbe', 'génial', 'formidable', 'parfait', 'magnifique'];
    const negativeWords = ['mauvais', 'terrible', 'horrible', 'nul', 'décevant', 'mediocre', 'pire'];

    const words = text.toLowerCase().split(/\W+/);
    
    let positive = 0;
    let negative = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positive++;
      if (negativeWords.includes(word)) negative++;
    });

    const total = positive + negative;
    const score = total > 0 ? (positive - negative) / total : 0;

    let sentiment = 'Neutre';
    if (score > 0.1) sentiment = 'Positif';
    else if (score < -0.1) sentiment = 'Négatif';

    return {
      score: Math.round(score * 100) / 100,
      sentiment,
      positive,
      negative,
      confidence: Math.min(100, Math.abs(score) * 100)
    };
  }

  static generateSEOAnalysis(text, title = '') {
    const analysis = {
      title: {
        length: title.length,
        optimal: title.length >= 40 && title.length <= 60,
        hasPrimaryKeyword: false
      },
      content: {
        length: text.length,
        wordCount: text.split(/\s+/).length,
        paragraphCount: (text.match(/<p[^>]*>/gi) || []).length,
        headingStructure: this.analyzeHeadings(text)
      },
      keywords: this.extractKeywords(text),
      readability: this.analyzeReadability(text),
      recommendations: []
    };

    // Générer les recommandations
    if (analysis.content.wordCount < 300) {
      analysis.recommendations.push('Le contenu est trop court. Ciblez au moins 300 mots.');
    }

    if (!analysis.title.optimal) {
      analysis.recommendations.push('Optimisez la longueur du titre (40-60 caractères).');
    }

    if (analysis.content.headingStructure.h1 > 1) {
      analysis.recommendations.push('Utilisez un seul titre H1 par page.');
    }

    return analysis;
  }

  static analyzeHeadings(text) {
    const h1 = (text.match(/<h1[^>]*>/gi) || []).length;
    const h2 = (text.match(/<h2[^>]*>/gi) || []).length;
    const h3 = (text.match(/<h3[^>]*>/gi) || []).length;

    return { h1, h2, h3 };
  }

  static extractKeywords(text, maxKeywords = 10) {
    const words = text.toLowerCase()
      .replace(/<[^>]*>/g, '')
      .split(/\W+/)
      .filter(word => word.length > 3);

    const stopWords = ['dans', 'avec', 'pour', 'dans', 'sur', 'sous', 'pendant', 'depuis'];
    const filteredWords = words.filter(word => !stopWords.includes(word));

    const freq = {};
    filteredWords.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });

    return Object.entries(freq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word, count]) => ({ word, count, density: (count / words.length * 100).toFixed(2) }));
  }
}