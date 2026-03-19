// export default function Question() {
//     return (
//         return (
//         <>
//             <section className="md:mt-20">
//                 <div className="container mx-auto p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr,1.25fr] gap-8">
//                         <div className="flex flex-col gap-4" id="config">
//                             <div className="text-white gap-4 flex items-center justify-center p-4 rounded w-full bg-neutral-700">
//                                 <div className="font-bold">Tempo:</div>
//                                 <span className="font-medium" id="time">{0}</span>
//                             </div>
//                             <div className="text-white gap-4 flex flex-col items-center justify-center p-4 rounded w-full bg-neutral-800">
//                                 <div className="font-bold">
//                                     <span className="font-medium" id="index">Pergunta: 9 de 10</span>
//                                 </div>
//                                 <div className="flex items-center flex-wrap justify-center gap-2">
//                                     <div className="rounded-full h-2.5 w-2.5 bg-green-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-green-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-green-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-green-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-yellow-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-yellow-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-red-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-red-400"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-white"></div>
//                                     <div className="rounded-full h-2.5 w-2.5 bg-white"></div>
//                                 </div>
//                             </div>
//                             <div className="bg-neutral-800 rounded grid grid-cols-2 gap-4 p-6 text-white">
//                                 <div className="font-bold">Matéria:</div>
//                                 <span className="font-medium" id="subject">Matemática</span>
//                                 <div className="font-bold">Conteúdo:</div>
//                                 <span className="font-medium" id="content">Trigonometria</span>
//                                 <div className="font-bold">Topic:</div>
//                                 <span className="font-medium" id="topic">Arcos</span>
//                                 <div className="font-bold">Dificuldade:</div>
//                                 <span className={`font-medium text-white`} id="difficulty">{4}</span>
//                             </div>
//                         </div>
//                         <main>
//                             <div id="question">
//                                 <div className="mb-4 p4 text-white grid grid-cols-1 gap-3 font-medium text-lg">
//                                     {'Carregando...'}
//                                 </div>
//                             </div>
//                             <div id="options" className="grid grid-cols-1 gap-3.5 mb-4">
//                                 {MCQ && alternatives.length > 0 ? alternatives.map((opt, index) => {
//                                     const letter = replaces[index];
//                                     const guess = alt === opt.id;
//                                     const check = choice === true ? 'hover:bg-green-600 bg-green-500 border-b-green-700' : 'hover:bg-red-600 bg-red-500 border-b-red-700';
//                                     return (
//                                         <label htmlFor={`ans-${letter}`} key={opt.id}>
//                                             <div className={`
//                                     ${guess ? (choice === null ? 'bg-indigo-600 border-b-indigo-800' : check) : 'hover:bg-indigo-300 bg-gray-200 border-b-gray-500'}
//                                     text-xl gap-4 cursor-pointer
//                                     has-[:checked]:text-white transition-all duration-300
//                                     flex items-center p-4 text-black border-b-4 rounded`}>
//                                                 <input type="radio" name="alternative" id={`ans-${letter}`} className="appearance-none hidden" onChange={() => AltChange(opt.id)} />
//                                                 <span className="font-medium">{letter}</span>
//                                                 {LaTexRender(opt.content)}
//                                             </div>
//                                         </label>
//                                     )
//                                 }) : (
//                                     <div className="text-black font-medium">
//                                         <MathInput onInputChange={setFrqAnswer} isCorrect={choice === true ? true : choice === false ? false : null} />
//                                     </div>
//                                 )
//                                 }
//                             </div>
//                             {showSkipConfirmation ? (
//                                 <div className="flex flex-col items-center justify-center gap-4 p-4 bg-gray-800 rounded">
//                                     <p className="text-white font-medium">Você tem certeza que deseja pular esta pergunta?</p>
//                                     <div className="flex gap-4">
//                                         <Button
//                                             id="cancel"
//                                             color="gray"
//                                             text="Cancelar"
//                                             onClick={cancelSkip}
//                                             extraClasses="p-3"
//                                         />
//                                         <Button
//                                             id="confirm-skip"
//                                             color="emerald"
//                                             text="Confirmar"
//                                             onClick={handleSkip}
//                                             extraClasses="p-3"
//                                         />
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center justify-center gap-3">
//                                     <Button
//                                         id="skip"
//                                         color="red"
//                                         text="Pular"
//                                         onClick={confirmSkip}
//                                         extraClasses="p-3"
//                                     />
//                                     <Button
//                                         id="confirm"
//                                         color="yellow"
//                                         text="Confirmar"
//                                         onClick={AltConfirm}
//                                         extraClasses="p-3"
//                                     />
//                                 </div>
//                             )}
//                         </main >
//                         <div id="hint" className="bg-teal-950 rounded flex flex-col gap-4 p-4 text-white">
//                             {hint ? LaTexRender(hint) : null}
//                             {!maxHintsReached && (
//                                 <Button
//                                     id="expand"
//                                     color="teal"
//                                     text="Pedir uma Dica"
//                                     onClick={getHint}
//                                     extraClasses="max-h-14 p-3"
//                                 />
//                             )}
//                         </div>
//                     </div >
//                 </div>
//             </section>
//         </>
//     )
// }
