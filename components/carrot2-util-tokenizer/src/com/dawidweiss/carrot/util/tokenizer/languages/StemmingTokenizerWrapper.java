/*
 * Carrot2 Project
 * Copyright (C) 2002-2004, Dawid Weiss
 * Portions (C) Contributors listed in carrot2.CONTRIBUTORS file.
 * All rights reserved.
 *
 * Refer to the full license file "carrot2.LICENSE"
 * in the root folder of the CVS checkout or at:
 * http://www.cs.put.poznan.pl/dweiss/carrot2.LICENSE
 */
package com.dawidweiss.carrot.util.tokenizer.languages;

import java.io.Reader;

import com.dawidweiss.carrot.core.local.linguistic.LanguageTokenizer;
import com.dawidweiss.carrot.core.local.linguistic.Stemmer;
import com.dawidweiss.carrot.core.local.linguistic.tokens.Token;
import com.dawidweiss.carrot.core.local.linguistic.tokens.TypedToken;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;


/**
 * A tokenizer that wraps around another tokenizer
 * and adds stems to the produced tokens.
 * 
 * <p>The wrapped tokenizer <b>must</b> produce
 *  tokens of type {@link MutableStemmedToken}.
 * 
 * @author Dawid Weiss
 * @version $Revision$
 */
final class StemmingTokenizerWrapper implements LanguageTokenizer {

    /** The wrapped tokenizer instance */
    private final LanguageTokenizer tokenizer;
    
    /** The wrapped stemmer instance */
    private final Stemmer stemmer;

    /** The stopwords set, or <code>null</code>. */
    private final HashSet stopwords;
    
    /**
     * Creates a new wrapper tokenizer with a stemmer, but no stopwords.
     * The underlying tokenizer must return instances of {@link MutableStemmedToken}.
     * 
     * @param tokenizer A tokenizer instance that will be wrapped.
     * @param stemmerInstance A stemmer instance used for stemming tokens' images.
     */
    public StemmingTokenizerWrapper(LanguageTokenizer tokenizer, Stemmer stemmer) {
        this.tokenizer = tokenizer;
        this.stemmer = stemmer;
        this.stopwords = null;
    }

    /**
     * Creates a new wrapper tokenizer with a stemmer and a set of stopwords.
     * The underlying tokenizer must return instances of {@link MutableStemmedToken}
     * also implementing {@link TypedToken}.
     * 
     * @param tokenizer A tokenizer instance that will be wrapped.
     * @param stemmerInstance A stemmer instance used for stemming tokens' images.
     */
    public StemmingTokenizerWrapper(LanguageTokenizer tokenizer, Stemmer stemmer, Set stopwords) {
        this.tokenizer = tokenizer;
        this.stemmer = stemmer;

        // process stopwords to their stems.
        this.stopwords = new HashSet();
        for (Iterator i = stopwords.iterator(); i.hasNext(); ) {
            String word = (String) i.next();
            String stem = stemmer.getStem(word.toLowerCase().toCharArray(), 0, word.length());
            if (stem == null) 
                this.stopwords.add( word );
            else
                this.stopwords.add( stem );
        }
    }
    
    
    /**
     * Delegates method call to the wrapped tokenizer.
     * 
     * @see com.dawidweiss.carrot.core.local.linguistic.LanguageTokenizer#restartTokenizationOn(java.io.Reader)
     */
    public void restartTokenizationOn(Reader stream) {
        tokenizer.restartTokenizationOn(stream);
    }

    /**
     * Delegates method call to the wrapped tokenizer.
     * @see com.dawidweiss.carrot.core.local.linguistic.LanguageTokenizer#reuse()
     */
    public void reuse() {
        tokenizer.reuse();
    }

    /**
     * Delegates method call to the wrapped tokenizer and
     * then performs stemming on the returned tokens.
     * 
     * @see com.dawidweiss.carrot.core.local.linguistic.LanguageTokenizer#getNextTokens(com.dawidweiss.carrot.core.local.linguistic.tokens.Token[], int)
     */
    public int getNextTokens(Token[] array, int startAt) {
        int count = tokenizer.getNextTokens(array, startAt);
        
        if (count != 0) {
            for (int i=startAt;i<startAt+count;i++) {
                MutableStemmedToken token = ((MutableStemmedToken) array[i]);
                String image = token.getImage();
                char [] charray = image.toCharArray();
                String stem = stemmer.getStem(charray, 0, charray.length);
                token.setStem(stem);

                if (this.stopwords != null) {
                    if ((stem == null && stopwords.contains(image.toLowerCase()))
                        || (stem != null && stopwords.contains(stem.toLowerCase()))) {
                        // attempt to set the stopword flag for this token
                        try {
                            token.setType( (short) (token.getType() | TypedToken.TOKEN_FLAG_STOPWORD) );
                        } catch (ClassCastException e) {
                            // oops, the tokenizer failed to return TypedToken instance.
                            throw new RuntimeException("The tokenizer failed to return a token implementing " +
                                    "TypedToken interface: "
                                    + token.getClass());
                        }
                    }
                }
            }
        }
        
        return count;
    }

}
