import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model questions
 *
 */
export type questionsModel = runtime.Types.Result.DefaultSelection<Prisma.$questionsPayload>;
export type AggregateQuestions = {
    _count: QuestionsCountAggregateOutputType | null;
    _min: QuestionsMinAggregateOutputType | null;
    _max: QuestionsMaxAggregateOutputType | null;
};
export type QuestionsMinAggregateOutputType = {
    id: string | null;
};
export type QuestionsMaxAggregateOutputType = {
    id: string | null;
};
export type QuestionsCountAggregateOutputType = {
    id: number;
    _all: number;
};
export type QuestionsMinAggregateInputType = {
    id?: true;
};
export type QuestionsMaxAggregateInputType = {
    id?: true;
};
export type QuestionsCountAggregateInputType = {
    id?: true;
    _all?: true;
};
export type QuestionsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which questions to aggregate.
     */
    where?: Prisma.questionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of questions to fetch.
     */
    orderBy?: Prisma.questionsOrderByWithRelationInput | Prisma.questionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.questionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` questions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` questions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned questions
    **/
    _count?: true | QuestionsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: QuestionsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: QuestionsMaxAggregateInputType;
};
export type GetQuestionsAggregateType<T extends QuestionsAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestions]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestions[P]> : Prisma.GetScalarType<T[P], AggregateQuestions[P]>;
};
export type questionsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.questionsWhereInput;
    orderBy?: Prisma.questionsOrderByWithAggregationInput | Prisma.questionsOrderByWithAggregationInput[];
    by: Prisma.QuestionsScalarFieldEnum[] | Prisma.QuestionsScalarFieldEnum;
    having?: Prisma.questionsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestionsCountAggregateInputType | true;
    _min?: QuestionsMinAggregateInputType;
    _max?: QuestionsMaxAggregateInputType;
};
export type QuestionsGroupByOutputType = {
    id: string;
    _count: QuestionsCountAggregateOutputType | null;
    _min: QuestionsMinAggregateOutputType | null;
    _max: QuestionsMaxAggregateOutputType | null;
};
type GetQuestionsGroupByPayload<T extends questionsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestionsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestionsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestionsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestionsGroupByOutputType[P]>;
}>>;
export type questionsWhereInput = {
    AND?: Prisma.questionsWhereInput | Prisma.questionsWhereInput[];
    OR?: Prisma.questionsWhereInput[];
    NOT?: Prisma.questionsWhereInput | Prisma.questionsWhereInput[];
    id?: Prisma.StringFilter<"questions"> | string;
};
export type questionsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
};
export type questionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.questionsWhereInput | Prisma.questionsWhereInput[];
    OR?: Prisma.questionsWhereInput[];
    NOT?: Prisma.questionsWhereInput | Prisma.questionsWhereInput[];
}, "id">;
export type questionsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    _count?: Prisma.questionsCountOrderByAggregateInput;
    _max?: Prisma.questionsMaxOrderByAggregateInput;
    _min?: Prisma.questionsMinOrderByAggregateInput;
};
export type questionsScalarWhereWithAggregatesInput = {
    AND?: Prisma.questionsScalarWhereWithAggregatesInput | Prisma.questionsScalarWhereWithAggregatesInput[];
    OR?: Prisma.questionsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.questionsScalarWhereWithAggregatesInput | Prisma.questionsScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"questions"> | string;
};
export type questionsCreateInput = {
    id?: string;
};
export type questionsUncheckedCreateInput = {
    id?: string;
};
export type questionsUpdateInput = {};
export type questionsUncheckedUpdateInput = {};
export type questionsCreateManyInput = {
    id?: string;
};
export type questionsUpdateManyMutationInput = {};
export type questionsUncheckedUpdateManyInput = {};
export type questionsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type questionsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type questionsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type questionsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
}, ExtArgs["result"]["questions"]>;
export type questionsSelectScalar = {
    id?: boolean;
};
export type questionsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id", ExtArgs["result"]["questions"]>;
export type $questionsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "questions";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
    }, ExtArgs["result"]["questions"]>;
    composites: {};
};
export type questionsGetPayload<S extends boolean | null | undefined | questionsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$questionsPayload, S>;
export type questionsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<questionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestionsCountAggregateInputType | true;
};
export interface questionsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['questions'];
        meta: {
            name: 'questions';
        };
    };
    /**
     * Find zero or one Questions that matches the filter.
     * @param {questionsFindUniqueArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends questionsFindUniqueArgs>(args: Prisma.SelectSubset<T, questionsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Questions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {questionsFindUniqueOrThrowArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends questionsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, questionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsFindFirstArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends questionsFindFirstArgs>(args?: Prisma.SelectSubset<T, questionsFindFirstArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Questions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsFindFirstOrThrowArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends questionsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, questionsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.questions.findMany()
     *
     * // Get first 10 Questions
     * const questions = await prisma.questions.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const questionsWithIdOnly = await prisma.questions.findMany({ select: { id: true } })
     *
     */
    findMany<T extends questionsFindManyArgs>(args?: Prisma.SelectSubset<T, questionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Questions.
     * @param {questionsCreateArgs} args - Arguments to create a Questions.
     * @example
     * // Create one Questions
     * const Questions = await prisma.questions.create({
     *   data: {
     *     // ... data to create a Questions
     *   }
     * })
     *
     */
    create<T extends questionsCreateArgs>(args: Prisma.SelectSubset<T, questionsCreateArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Questions.
     * @param {questionsCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const questions = await prisma.questions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends questionsCreateManyArgs>(args?: Prisma.SelectSubset<T, questionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Questions.
     * @param {questionsDeleteArgs} args - Arguments to delete one Questions.
     * @example
     * // Delete one Questions
     * const Questions = await prisma.questions.delete({
     *   where: {
     *     // ... filter to delete one Questions
     *   }
     * })
     *
     */
    delete<T extends questionsDeleteArgs>(args: Prisma.SelectSubset<T, questionsDeleteArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Questions.
     * @param {questionsUpdateArgs} args - Arguments to update one Questions.
     * @example
     * // Update one Questions
     * const questions = await prisma.questions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends questionsUpdateArgs>(args: Prisma.SelectSubset<T, questionsUpdateArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Questions.
     * @param {questionsDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.questions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends questionsDeleteManyArgs>(args?: Prisma.SelectSubset<T, questionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const questions = await prisma.questions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends questionsUpdateManyArgs>(args: Prisma.SelectSubset<T, questionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Questions.
     * @param {questionsUpsertArgs} args - Arguments to update or create a Questions.
     * @example
     * // Update or create a Questions
     * const questions = await prisma.questions.upsert({
     *   create: {
     *     // ... data to create a Questions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Questions we want to update
     *   }
     * })
     */
    upsert<T extends questionsUpsertArgs>(args: Prisma.SelectSubset<T, questionsUpsertArgs<ExtArgs>>): Prisma.Prisma__questionsClient<runtime.Types.Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Questions that matches the filter.
     * @param {questionsFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const questions = await prisma.questions.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.questionsFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a Questions.
     * @param {questionsAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const questions = await prisma.questions.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.questionsAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.questions.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends questionsCountArgs>(args?: Prisma.Subset<T, questionsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestionsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionsAggregateArgs>(args: Prisma.Subset<T, QuestionsAggregateArgs>): Prisma.PrismaPromise<GetQuestionsAggregateType<T>>;
    /**
     * Group by Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends questionsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: questionsGroupByArgs['orderBy'];
    } : {
        orderBy?: questionsGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, questionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the questions model
     */
    readonly fields: questionsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for questions.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__questionsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the questions model
 */
export interface questionsFieldRefs {
    readonly id: Prisma.FieldRef<"questions", 'String'>;
}
/**
 * questions findUnique
 */
export type questionsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * Filter, which questions to fetch.
     */
    where: Prisma.questionsWhereUniqueInput;
};
/**
 * questions findUniqueOrThrow
 */
export type questionsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * Filter, which questions to fetch.
     */
    where: Prisma.questionsWhereUniqueInput;
};
/**
 * questions findFirst
 */
export type questionsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * Filter, which questions to fetch.
     */
    where?: Prisma.questionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of questions to fetch.
     */
    orderBy?: Prisma.questionsOrderByWithRelationInput | Prisma.questionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for questions.
     */
    cursor?: Prisma.questionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` questions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` questions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of questions.
     */
    distinct?: Prisma.QuestionsScalarFieldEnum | Prisma.QuestionsScalarFieldEnum[];
};
/**
 * questions findFirstOrThrow
 */
export type questionsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * Filter, which questions to fetch.
     */
    where?: Prisma.questionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of questions to fetch.
     */
    orderBy?: Prisma.questionsOrderByWithRelationInput | Prisma.questionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for questions.
     */
    cursor?: Prisma.questionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` questions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` questions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of questions.
     */
    distinct?: Prisma.QuestionsScalarFieldEnum | Prisma.QuestionsScalarFieldEnum[];
};
/**
 * questions findMany
 */
export type questionsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * Filter, which questions to fetch.
     */
    where?: Prisma.questionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of questions to fetch.
     */
    orderBy?: Prisma.questionsOrderByWithRelationInput | Prisma.questionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing questions.
     */
    cursor?: Prisma.questionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` questions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` questions.
     */
    skip?: number;
    distinct?: Prisma.QuestionsScalarFieldEnum | Prisma.QuestionsScalarFieldEnum[];
};
/**
 * questions create
 */
export type questionsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * The data needed to create a questions.
     */
    data?: Prisma.XOR<Prisma.questionsCreateInput, Prisma.questionsUncheckedCreateInput>;
};
/**
 * questions createMany
 */
export type questionsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many questions.
     */
    data: Prisma.questionsCreateManyInput | Prisma.questionsCreateManyInput[];
};
/**
 * questions update
 */
export type questionsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * The data needed to update a questions.
     */
    data: Prisma.XOR<Prisma.questionsUpdateInput, Prisma.questionsUncheckedUpdateInput>;
    /**
     * Choose, which questions to update.
     */
    where: Prisma.questionsWhereUniqueInput;
};
/**
 * questions updateMany
 */
export type questionsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update questions.
     */
    data: Prisma.XOR<Prisma.questionsUpdateManyMutationInput, Prisma.questionsUncheckedUpdateManyInput>;
    /**
     * Filter which questions to update
     */
    where?: Prisma.questionsWhereInput;
    /**
     * Limit how many questions to update.
     */
    limit?: number;
};
/**
 * questions upsert
 */
export type questionsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * The filter to search for the questions to update in case it exists.
     */
    where: Prisma.questionsWhereUniqueInput;
    /**
     * In case the questions found by the `where` argument doesn't exist, create a new questions with this data.
     */
    create: Prisma.XOR<Prisma.questionsCreateInput, Prisma.questionsUncheckedCreateInput>;
    /**
     * In case the questions was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.questionsUpdateInput, Prisma.questionsUncheckedUpdateInput>;
};
/**
 * questions delete
 */
export type questionsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
    /**
     * Filter which questions to delete.
     */
    where: Prisma.questionsWhereUniqueInput;
};
/**
 * questions deleteMany
 */
export type questionsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which questions to delete
     */
    where?: Prisma.questionsWhereInput;
    /**
     * Limit how many questions to delete.
     */
    limit?: number;
};
/**
 * questions findRaw
 */
export type questionsFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: runtime.InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: runtime.InputJsonValue;
};
/**
 * questions aggregateRaw
 */
export type questionsAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: runtime.InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: runtime.InputJsonValue;
};
/**
 * questions without action
 */
export type questionsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: Prisma.questionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the questions
     */
    omit?: Prisma.questionsOmit<ExtArgs> | null;
};
export {};
