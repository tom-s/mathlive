
/**
 * Reference
 * TeX source code:
 * @see {@link  http://tug.org/texlive/devsrc/Build/source/texk/web2c/tex.web|Tex.web}
 * 
 * For a list of standard TeX macros, see:
 * @see {@link ftp://tug.ctan.org/pub/tex-archive/systems/knuth/dist/lib/plain.tex|plain.tex}
// https://github.com/kostub/iosMath/blob/master/EXAMPLES.md
 */

define(['mathlive/core/lexer', 'mathlive/core/mathAtom', 'mathlive/core/parser', 
'mathlive/core/context', 'mathlive/core/span', 'mathlive/editor/editor-mathfield'], 
    function(Lexer, MathAtom, ParserModule, Context, Span, MathField) {

/**
 * 
 * @param {string} text 
 * @param {boolean} displayMode 
 */
function toMarkup(text, displayMode, format) {
    //
    // 1. Tokenize the text
    //
    const tokens = Lexer.tokenize(text);

    //
    // 2. Parse each token in the formula
    //    Turn the list of tokens in the formula into
    //    a tree of high-level MathAtom, e.g. 'genfrac'.
    //

    const mathlist = ParserModule.parseTokens(tokens);

    if (format === 'mathlist') return mathlist;



    //
    // 3. Transform the math atoms into elementary spans
    //    for example from genfrac to vlist.
    //
    let spans = MathAtom.decompose(
        {mathstyle: displayMode ? 'displaystyle' : 'textstyle'}, 
        mathlist);


    // 
    // 4. Simplify by coalescing adjacent nodes
    //    for example, from <span>1</span><span>2</span> 
    //    to <span>12</span>
    //
    spans = Span.coalesce(spans);

    if (format === 'span') return spans;

    //
    // 5. Wrap the expression with struts
    //
    const base = Span.makeSpan(spans, 'ML__base');

    const topStrut = Span.makeSpan('', 'ML__strut');
    topStrut.setStyle('height', base.height, 'em');
    const bottomStrut = Span.makeSpan('', 'ML__strut ML__bottom');
    bottomStrut.setStyle('height', base.height + base.depth, 'em');
    bottomStrut.setStyle('vertical-align', -base.depth, 'em');
    const wrapper = Span.makeSpan([topStrut, bottomStrut, base], 'ML__mathlive');


    // 
    // 6. Generate markup
    //

    return wrapper.toMarkup();
}


function makeMathField(el, options) {
    if (!MathField) {
        console.log('The MathField module is not loaded.');
    }
    return new MathField.MathField(el, options)
}

function toSpeakableText() {
    if (!MathAtom.toSpeakableText) {
        console.log('The SpokenText module is not loaded.');
    }
    MathAtom.toSpeakableText();
}

return {
    latexToMarkup: toMarkup,
    latexToSpeakableText: toSpeakableText,
    makeMathField: makeMathField,
    MathField: MathField.MathField
}


})
