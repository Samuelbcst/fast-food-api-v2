import { UseCaseResult } from "./use-case-result"

export interface UseCase<
    Input extends unknown,
    Output extends undefined | unknown,
> {
    execute(input: Input): Promise<UseCaseResult<Output>>
    onFinish(): Promise<void>
}
