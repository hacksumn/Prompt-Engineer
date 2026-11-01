export function statedRole(topic){
 const m=String(topic).match(/\b(?:as if you (?:were|are)|acting as|act as|pretend (?:you are|to be)|you are|play the role of|take the role of)\s+((?:an?|the)\s+[a-z][a-z\- ]{2,50}?)(?=[.,;:!?\n]|\s+(?:and|who|that|to|for|in|with|so|when|because|please)\b|$)/i);
 return m?m[1].trim():null;
}
export function inferTopic(topic){
 const rules=[
 [/\b(?:prompts?|prompting|llms?)\b/i,'an expert prompt engineer who designs, tests, and evaluates prompts for specific models','prompt engineering'],
 [/\b(?:code|coding|software|python|javascript|typescript|programming|apps?|websites?|repos?|repositor(?:y|ies)|github|gitlab|codebase|scripts?|apis?|html|css|sql|bugs?)\b/i,'a senior software engineer and practical technical mentor','software development'],
 [/\b(?:cars?|vehicles?|trucks?|engines?|brakes?|starters?|alternators?|automotive)\b/i,'an experienced automotive diagnostic technician','automotive diagnosis'],
 [/\b(?:wi-?fi|routers?|modems?|ethernet|internet|networks?)\b/i,'an experienced network troubleshooting specialist','home networking'],
 [/\b(?:health|sleep|symptoms?|diets?|nutrition|medicines?|medications?|medical|anxiety|fitness|exercises?)\b/i,'a qualified health researcher who clearly separates general education from personal medical advice','health research'],
 [/\b(?:invest(?:s|ed|ing|ments?|ors?)?|money|budgets?|debts?|financ(?:e|es|ial)|stocks?|retirement|savings?|saving|taxes)\b/i,'an independent financial educator who explains risk and uncertainty','personal finance'],
 [/\b(?:jobs?|careers?|resumes?|interviews?|promotions?)\b/i,'an experienced career strategist and hiring specialist','career development'],
 [/\b(?:write|writing|story|brand|content|email|creative)\b/i,'an experienced editor and creative strategist','writing and communication'],
 [/\b(?:learn|study|course|exam|school)\b/i,'an expert educator and evidence-informed learning coach','learning'],
 ];
 const match=rules.find(([re])=>re.test(topic));
 const stated=statedRole(topic);
 const domain=match?.[2]||'your topic';
 const improvable=['prompt engineering','software development','career development','writing and communication','your topic'];
 const improveVerb=/\b(?:improv\w*|perfect\w*|optimi[sz]\w*|refactor\w*|polish\w*|refin\w*|revis\w*|upgrad\w*|enhanc\w*|strengthen\w*|tighten\w*|audit\w*|review\w*|critiqu\w*|analy[sz]\w*)\b/i.test(topic);
 const ownWork=/\b(?:my|our|mine|i['’]?ve|ive|i\s+(?:have|built|made|wrote|created)|existing)\b/i.test(topic)||domain==='software development'||domain==='prompt engineering';
 const kind=/\b(fix|troubleshoot|broken|stuck|error|diagnose)\b|won[’']?t|not working|doesn[’']?t|dropout/i.test(topic)?'troubleshoot':improveVerb&&ownWork&&improvable.includes(domain)?'improve':/\b(compare|choose|best|decide|buy|versus)\b/i.test(topic)?'decision':/\b(write|create|draft|design)\b/i.test(topic)?'create':'research';
 return {role:stated||match?.[1]||'an experienced subject-matter expert and rigorous researcher in the topic I describe',domain,kind,stated:Boolean(stated)};
}
export function nextQuestion(topic,answers){
 const p=inferTopic(topic);
 if(answers.length===0)return {title:'1. Which expert perspective should lead?',options:[p.role,'A patient expert teacher who starts with the fundamentals','An independent researcher who challenges claims and compares primary evidence']};
 if(answers.length===1){
  if(p.domain==='automotive diagnosis'&&p.kind==='troubleshoot')return {title:'2. When you try to start it, what happens?',options:['The engine does not crank','The engine cranks but does not start','I am not sure yet']};
  if(p.domain==='home networking')return {title:'2. What best describes the situation?',options:['Weak signal or dead zones','Slow speeds or dropped connections','I need help identifying the problem']};
  if(p.kind==='troubleshoot')return {title:'2. Where are you getting stuck?',options:['I am starting from scratch','I tried a fix, but it did not help','I need help identifying the cause']};
  if(p.kind==='improve')return {title:'2. How far should the expert go?',options:['Audit what exists, then fix the highest-impact problems first','Review only: findings and recommendations, no rewrites','Rebuild or rewrite it end to end, with a change log']};
  if(p.kind==='decision')return {title:'2. What would make this decision easier?',options:['Compare the realistic options','Find the criteria that matter','Challenge my preferred option']};
  if(p.kind==='create')return {title:'2. Where should we start?',options:['Explore distinctive ideas','Create a usable first draft','Improve something I already have']};
  return {title:`2. Which angle on ${p.domain} matters most?`,options:['What does the strongest evidence say?','Explain how it works in plain language','Show me how to apply it in real life']};
 }
 const a=answers[1]||'';
 if(a==='The engine does not crank')return {title:'3. What should the diagnostic technician help you achieve first?',options:['A safe checklist to distinguish battery, connection, and starter possibilities','Understand what each symptom can and cannot tell me','Know when to stop and call a professional']};
 if(a==='The engine cranks but does not start')return {title:'3. How should the technician approach a crank-but-no-start problem?',options:['A safe sequence of observations and diagnostic checks','Explain possible causes without guessing a diagnosis','Prepare the right information for a repair shop']};
 if(p.kind==='improve')return {title:'3. What should you walk away with?',options:['A prioritized findings list with severity, evidence, and ready-to-apply fixes','A rewritten version plus a change log explaining every improvement','A scored review with criteria, confidence levels, and remaining unknowns']};
 if(a.includes('evidence')||a.includes('claims'))return {title:'3. What should your research answer deliver?',options:['A detailed evidence review with primary sources and counterarguments','A clear conclusion with confidence levels and remaining unknowns','A comparison of expert disagreements and what would resolve them']};
 if(a.includes('plain language')||a.includes('scratch'))return {title:'3. What would make the explanation useful to you?',options:['A beginner-friendly walkthrough with concrete examples','A step-by-step plan with prerequisites and checks','A deep explanation that defines every technical term']};
 if(p.kind==='troubleshoot')return {title:'3. What would a successful fix look like?',options:['A safe, prioritized troubleshooting checklist with success checks','Compare likely causes and explain which tests distinguish them','Clear next steps, common mistakes, and when to get expert help']};
 if(p.kind==='decision')return {title:'3. What should the expert produce for your decision?',options:['A comparison table and a reasoned recommendation','A decision framework with tradeoffs and uncertainties','A critical review of assumptions, risks, and alternative options']};
 if(p.kind==='create')return {title:'3. What should you walk away with?',options:['A polished first draft with clear assumptions','Three distinctive directions with examples and tradeoffs','A critique and improved version with explanations']};
 return {title:'3. What would a useful outcome look like?',options:['A practical action plan with examples and checks','A detailed explanation with sources, caveats, and useful specifics','A focused recommendation and what would change it']};
}
export function buildAdaptive(topic,answers,model){
 const p=inferTopic(topic),selected=[...answers],assumptions=[];
 while(selected.length<3){const q=nextQuestion(topic,selected);selected.push(q.options[0]);assumptions.push(`${q.title}: ${q.options[0]} (suggested default, not confirmed by me)`);}
 const inspect=p.kind==='improve'?' Inspect the actual material before judging it. If you cannot access it, say so and ask me to provide it instead of guessing its contents.':'';
 return {role:selected[0],input:`GUIDED A.I.M. INTAKE\nMy original request:\n${topic.trim()}\n\nFocus I selected or was offered: ${selected[1]}\nDesired deliverable: ${selected[2]}\n\n${assumptions.length?'Provisional assumptions — confirm only if consequential:\n'+assumptions.join('\n'):'All three guided choices were selected by me.'}\n\nGive rich, specific detail and concrete examples. Prefer authoritative primary sources; do not invent sources or imply that verification occurred when it did not. Do not repeat questions already answered here. Ask only missing questions that would materially change the answer, and offer sensible choices.`,mission:`Address my request: ${topic.trim()}\nDeliver: ${selected[2]}`,audience:'Me, for personal understanding and practical use',constraints:'State uncertainty, distinguish facts from assumptions, and avoid generic advice. For consequential health, legal, financial, or physical safety topics, explain limitations and when qualified help is needed.'+inspect,format:p.kind==='troubleshoot'?'A step-by-step action plan':p.kind==='improve'?'A prioritized audit with ready-to-apply fixes':p.kind==='decision'?'A comparison table and recommendation':'A detailed report with an executive summary',model};
}
