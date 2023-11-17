import {FieldsSelection,Observable} from '@genql/runtime'

export type Scalars = {
    String: string,
    ID: string,
    Int: number,
    Float: number,
    Boolean: boolean,
}

export interface CheckoutSession {
    checkoutUrl: Scalars['String']
    __typename?: 'CheckoutSession'
}

export interface Creation {
    completionStatus: CreationCompletionStatus
    createdAt: Scalars['String']
    id: Scalars['ID']
    iterationCount: Scalars['Int']
    negativePrompt?: Scalars['String']
    parentCreationId?: Scalars['String']
    resultImageUrl?: Scalars['String']
    startingImageUrl?: Scalars['String']
    styles: Style[]
    textPrompt?: Scalars['String']
    updatedAt: Scalars['String']
    variationCount: Scalars['Int']
    variations: Variation[]
    __typename?: 'Creation'
}

export type CreationCompletionStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'

export type Currency = 'EUR' | 'UAH' | 'USD'

export interface CurrencyToTotalDonation {
    EUR: Scalars['Float']
    UAH: Scalars['Float']
    USD: Scalars['Float']
    __typename?: 'CurrencyToTotalDonation'
}

export interface Mutation {
    createCheckoutSession: CheckoutSession
    createSupportRequest: Scalars['Boolean']
    deleteCreation: Scalars['Boolean']
    deleteMyUser: Scalars['Boolean']
    setCreationThumbnail: Creation
    setUserReferrerId: User
    setVariationPublicity: Variation
    __typename?: 'Mutation'
}

export interface PaginatedCreations {
    creations: Creation[]
    lastPage: Scalars['Int']
    limit: Scalars['Int']
    page: Scalars['Int']
    total: Scalars['Int']
    __typename?: 'PaginatedCreations'
}

export interface PaginatedVariations {
    lastPage: Scalars['Int']
    limit: Scalars['Int']
    page: Scalars['Int']
    total: Scalars['Int']
    variations: Variation[]
    __typename?: 'PaginatedVariations'
}

export interface Query {
    creation: Creation
    me: User
    myCreations: PaginatedCreations
    myStats: UserStats
    sharedVariations: PaginatedVariations
    styles: Style[]
    surprisePrompts: SurprisePrompt[]
    tokenAcquisition: TokenAcquisition
    user: User
    __typename?: 'Query'
}

export interface Style {
    createdAt?: Scalars['String']
    id: Scalars['ID']
    imageUrl: Scalars['String']
    name: Scalars['String']
    negativePrompt: Scalars['String']
    prompt: Scalars['String']
    updatedAt?: Scalars['String']
    __typename?: 'Style'
}

export interface SurprisePrompt {
    createdAt?: Scalars['String']
    id: Scalars['ID']
    prompt: Scalars['String']
    updatedAt?: Scalars['String']
    __typename?: 'SurprisePrompt'
}

export interface TokenAcquisition {
    createdAt: Scalars['String']
    donationCurrencyToTokenExchangeRate: Scalars['Float']
    id: Scalars['ID']
    paymentProviderTransactionId?: Scalars['String']
    status: TokenAcquisitionStatus
    tokenNumber: Scalars['Int']
    updatedAt: Scalars['String']
    userId: Scalars['String']
    __typename?: 'TokenAcquisition'
}

export type TokenAcquisitionStatus = 'APPROVED' | 'DECLINED' | 'EXPIRED' | 'INITIATED' | 'IN_PROGRESS'

export interface User {
    avatarUrl?: Scalars['String']
    createdAt: Scalars['String']
    email: Scalars['String']
    firstName?: Scalars['String']
    id: Scalars['ID']
    isActive: Scalars['Int']
    isLaunchWaitlistMember: Scalars['Int']
    lastName?: Scalars['String']
    role: UserRole
    tokenNumber: Scalars['Int']
    updatedAt: Scalars['String']
    __typename?: 'User'
}

export type UserRole = 'ADMIN' | 'CUSTOMER'

export interface UserStats {
    totalCreations: Scalars['Int']
    totalDonationsByCurrency: CurrencyToTotalDonation
    totalReferrals: Scalars['Int']
    __typename?: 'UserStats'
}

export interface Variation {
    createdAt: Scalars['String']
    creation: VariationCreation
    creationId: Scalars['ID']
    id: Scalars['ID']
    imageUrl?: Scalars['String']
    isSharedToCommunity: Scalars['Int']
    updatedAt: Scalars['String']
    __typename?: 'Variation'
}

export interface VariationCreation {
    id: Scalars['ID']
    iterationCount: Scalars['Int']
    negativePrompt?: Scalars['String']
    resultImageUrl?: Scalars['String']
    startingImageUrl?: Scalars['String']
    styles: Style[]
    textPrompt?: Scalars['String']
    variationCount: Scalars['Int']
    __typename?: 'VariationCreation'
}

export interface CheckoutSessionRequest{
    checkoutUrl?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CreationRequest{
    completionStatus?: boolean | number
    createdAt?: boolean | number
    id?: boolean | number
    iterationCount?: boolean | number
    negativePrompt?: boolean | number
    parentCreationId?: boolean | number
    resultImageUrl?: boolean | number
    startingImageUrl?: boolean | number
    styles?: StyleRequest
    textPrompt?: boolean | number
    updatedAt?: boolean | number
    variationCount?: boolean | number
    variations?: VariationRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CurrencyToTotalDonationRequest{
    EUR?: boolean | number
    UAH?: boolean | number
    USD?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationRequest{
    createCheckoutSession?: [{amount: Scalars['Int'],currency: Currency},CheckoutSessionRequest]
    createSupportRequest?: [{customerEmail: Scalars['String'],details: Scalars['String'],subject: Scalars['String']}]
    deleteCreation?: [{creationId: Scalars['String']}]
    deleteMyUser?: boolean | number
    setCreationThumbnail?: [{creationId: Scalars['String'],thumbnailUrl: Scalars['String']},CreationRequest]
    setUserReferrerId?: [{referrerId: Scalars['String']},UserRequest]
    setVariationPublicity?: [{isSharedToCommunity: Scalars['Int'],variationId: Scalars['String']},VariationRequest]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PaginatedCreationsRequest{
    creations?: CreationRequest
    lastPage?: boolean | number
    limit?: boolean | number
    page?: boolean | number
    total?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PaginatedVariationsRequest{
    lastPage?: boolean | number
    limit?: boolean | number
    page?: boolean | number
    total?: boolean | number
    variations?: VariationRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryRequest{
    creation?: [{creationId: Scalars['String']},CreationRequest]
    me?: UserRequest
    myCreations?: [{limit?: (Scalars['Int'] | null),page?: (Scalars['Int'] | null)},PaginatedCreationsRequest] | PaginatedCreationsRequest
    myStats?: UserStatsRequest
    sharedVariations?: [{limit?: (Scalars['Int'] | null),page?: (Scalars['Int'] | null)},PaginatedVariationsRequest] | PaginatedVariationsRequest
    styles?: StyleRequest
    surprisePrompts?: SurprisePromptRequest
    tokenAcquisition?: [{tokenAcquisitionId: Scalars['String']},TokenAcquisitionRequest]
    user?: [{id: Scalars['String']},UserRequest]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StyleRequest{
    createdAt?: boolean | number
    id?: boolean | number
    imageUrl?: boolean | number
    name?: boolean | number
    negativePrompt?: boolean | number
    prompt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SurprisePromptRequest{
    createdAt?: boolean | number
    id?: boolean | number
    prompt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface TokenAcquisitionRequest{
    createdAt?: boolean | number
    donationCurrencyToTokenExchangeRate?: boolean | number
    id?: boolean | number
    paymentProviderTransactionId?: boolean | number
    status?: boolean | number
    tokenNumber?: boolean | number
    updatedAt?: boolean | number
    userId?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserRequest{
    avatarUrl?: boolean | number
    createdAt?: boolean | number
    email?: boolean | number
    firstName?: boolean | number
    id?: boolean | number
    isActive?: boolean | number
    isLaunchWaitlistMember?: boolean | number
    lastName?: boolean | number
    role?: boolean | number
    tokenNumber?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserStatsRequest{
    totalCreations?: boolean | number
    totalDonationsByCurrency?: CurrencyToTotalDonationRequest
    totalReferrals?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface VariationRequest{
    createdAt?: boolean | number
    creation?: VariationCreationRequest
    creationId?: boolean | number
    id?: boolean | number
    imageUrl?: boolean | number
    isSharedToCommunity?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface VariationCreationRequest{
    id?: boolean | number
    iterationCount?: boolean | number
    negativePrompt?: boolean | number
    resultImageUrl?: boolean | number
    startingImageUrl?: boolean | number
    styles?: StyleRequest
    textPrompt?: boolean | number
    variationCount?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


const CheckoutSession_possibleTypes = ['CheckoutSession']
export const isCheckoutSession = (obj?: { __typename?: any } | null): obj is CheckoutSession => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isCheckoutSession"')
  return CheckoutSession_possibleTypes.includes(obj.__typename)
}



const Creation_possibleTypes = ['Creation']
export const isCreation = (obj?: { __typename?: any } | null): obj is Creation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isCreation"')
  return Creation_possibleTypes.includes(obj.__typename)
}



const CurrencyToTotalDonation_possibleTypes = ['CurrencyToTotalDonation']
export const isCurrencyToTotalDonation = (obj?: { __typename?: any } | null): obj is CurrencyToTotalDonation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isCurrencyToTotalDonation"')
  return CurrencyToTotalDonation_possibleTypes.includes(obj.__typename)
}



const Mutation_possibleTypes = ['Mutation']
export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



const PaginatedCreations_possibleTypes = ['PaginatedCreations']
export const isPaginatedCreations = (obj?: { __typename?: any } | null): obj is PaginatedCreations => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isPaginatedCreations"')
  return PaginatedCreations_possibleTypes.includes(obj.__typename)
}



const PaginatedVariations_possibleTypes = ['PaginatedVariations']
export const isPaginatedVariations = (obj?: { __typename?: any } | null): obj is PaginatedVariations => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isPaginatedVariations"')
  return PaginatedVariations_possibleTypes.includes(obj.__typename)
}



const Query_possibleTypes = ['Query']
export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



const Style_possibleTypes = ['Style']
export const isStyle = (obj?: { __typename?: any } | null): obj is Style => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isStyle"')
  return Style_possibleTypes.includes(obj.__typename)
}



const SurprisePrompt_possibleTypes = ['SurprisePrompt']
export const isSurprisePrompt = (obj?: { __typename?: any } | null): obj is SurprisePrompt => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isSurprisePrompt"')
  return SurprisePrompt_possibleTypes.includes(obj.__typename)
}



const TokenAcquisition_possibleTypes = ['TokenAcquisition']
export const isTokenAcquisition = (obj?: { __typename?: any } | null): obj is TokenAcquisition => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isTokenAcquisition"')
  return TokenAcquisition_possibleTypes.includes(obj.__typename)
}



const User_possibleTypes = ['User']
export const isUser = (obj?: { __typename?: any } | null): obj is User => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
  return User_possibleTypes.includes(obj.__typename)
}



const UserStats_possibleTypes = ['UserStats']
export const isUserStats = (obj?: { __typename?: any } | null): obj is UserStats => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isUserStats"')
  return UserStats_possibleTypes.includes(obj.__typename)
}



const Variation_possibleTypes = ['Variation']
export const isVariation = (obj?: { __typename?: any } | null): obj is Variation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isVariation"')
  return Variation_possibleTypes.includes(obj.__typename)
}



const VariationCreation_possibleTypes = ['VariationCreation']
export const isVariationCreation = (obj?: { __typename?: any } | null): obj is VariationCreation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isVariationCreation"')
  return VariationCreation_possibleTypes.includes(obj.__typename)
}


export interface CheckoutSessionPromiseChain{checkoutUrl:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>})}

export interface CheckoutSessionObservableChain{checkoutUrl:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>})}

export interface CreationPromiseChain{completionStatus:({get:(request?:boolean|number,defaultValue?:CreationCompletionStatus)=>Promise<CreationCompletionStatus>}),createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),iterationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),negativePrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),parentCreationId:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),resultImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),startingImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),styles:({get: (request: StyleRequest, defaultValue?:Style[])=>Promise<Style[]>}),textPrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),variationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),variations:({get: (request: VariationRequest, defaultValue?:Variation[])=>Promise<Variation[]>})}

export interface CreationObservableChain{completionStatus:({get:(request?:boolean|number,defaultValue?:CreationCompletionStatus)=>Observable<CreationCompletionStatus>}),createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),iterationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),negativePrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),parentCreationId:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),resultImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),startingImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),styles:({get: (request: StyleRequest, defaultValue?:Style[])=>Observable<Style[]>}),textPrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),variationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),variations:({get: (request: VariationRequest, defaultValue?:Variation[])=>Observable<Variation[]>})}

export interface CurrencyToTotalDonationPromiseChain{EUR:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Promise<Scalars['Float']>}),UAH:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Promise<Scalars['Float']>}),USD:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Promise<Scalars['Float']>})}

export interface CurrencyToTotalDonationObservableChain{EUR:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Observable<Scalars['Float']>}),UAH:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Observable<Scalars['Float']>}),USD:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Observable<Scalars['Float']>})}

export interface MutationPromiseChain{createCheckoutSession:((args:{amount: Scalars['Int'],currency: Currency})=>CheckoutSessionPromiseChain & {get: (request: CheckoutSessionRequest, defaultValue?:CheckoutSession)=>Promise<CheckoutSession>}),createSupportRequest:((args:{customerEmail: Scalars['String'],details: Scalars['String'],subject: Scalars['String']})=>{get:(request?:boolean|number,defaultValue?:Scalars['Boolean'])=>Promise<Scalars['Boolean']>}),deleteCreation:((args:{creationId: Scalars['String']})=>{get:(request?:boolean|number,defaultValue?:Scalars['Boolean'])=>Promise<Scalars['Boolean']>}),deleteMyUser:({get:(request?:boolean|number,defaultValue?:Scalars['Boolean'])=>Promise<Scalars['Boolean']>}),setCreationThumbnail:((args:{creationId: Scalars['String'],thumbnailUrl: Scalars['String']})=>CreationPromiseChain & {get: (request: CreationRequest, defaultValue?:Creation)=>Promise<Creation>}),setUserReferrerId:((args:{referrerId: Scalars['String']})=>UserPromiseChain & {get: (request: UserRequest, defaultValue?:User)=>Promise<User>}),setVariationPublicity:((args:{isSharedToCommunity: Scalars['Int'],variationId: Scalars['String']})=>VariationPromiseChain & {get: (request: VariationRequest, defaultValue?:Variation)=>Promise<Variation>})}

export interface MutationObservableChain{createCheckoutSession:((args:{amount: Scalars['Int'],currency: Currency})=>CheckoutSessionObservableChain & {get: (request: CheckoutSessionRequest, defaultValue?:CheckoutSession)=>Observable<CheckoutSession>}),createSupportRequest:((args:{customerEmail: Scalars['String'],details: Scalars['String'],subject: Scalars['String']})=>{get:(request?:boolean|number,defaultValue?:Scalars['Boolean'])=>Observable<Scalars['Boolean']>}),deleteCreation:((args:{creationId: Scalars['String']})=>{get:(request?:boolean|number,defaultValue?:Scalars['Boolean'])=>Observable<Scalars['Boolean']>}),deleteMyUser:({get:(request?:boolean|number,defaultValue?:Scalars['Boolean'])=>Observable<Scalars['Boolean']>}),setCreationThumbnail:((args:{creationId: Scalars['String'],thumbnailUrl: Scalars['String']})=>CreationObservableChain & {get: (request: CreationRequest, defaultValue?:Creation)=>Observable<Creation>}),setUserReferrerId:((args:{referrerId: Scalars['String']})=>UserObservableChain & {get: (request: UserRequest, defaultValue?:User)=>Observable<User>}),setVariationPublicity:((args:{isSharedToCommunity: Scalars['Int'],variationId: Scalars['String']})=>VariationObservableChain & {get: (request: VariationRequest, defaultValue?:Variation)=>Observable<Variation>})}

export interface PaginatedCreationsPromiseChain{creations:({get: (request: CreationRequest, defaultValue?:Creation[])=>Promise<Creation[]>}),lastPage:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),limit:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),page:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),total:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>})}

export interface PaginatedCreationsObservableChain{creations:({get: (request: CreationRequest, defaultValue?:Creation[])=>Observable<Creation[]>}),lastPage:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),limit:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),page:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),total:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>})}

export interface PaginatedVariationsPromiseChain{lastPage:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),limit:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),page:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),total:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),variations:({get: (request: VariationRequest, defaultValue?:Variation[])=>Promise<Variation[]>})}

export interface PaginatedVariationsObservableChain{lastPage:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),limit:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),page:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),total:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),variations:({get: (request: VariationRequest, defaultValue?:Variation[])=>Observable<Variation[]>})}

export interface QueryPromiseChain{creation:((args:{creationId: Scalars['String']})=>CreationPromiseChain & {get: (request: CreationRequest, defaultValue?:Creation)=>Promise<Creation>}),me:(UserPromiseChain & {get: (request: UserRequest, defaultValue?:User)=>Promise<User>}),myCreations:((args?:{limit?: (Scalars['Int'] | null),page?: (Scalars['Int'] | null)})=>PaginatedCreationsPromiseChain & {get: (request: PaginatedCreationsRequest, defaultValue?:PaginatedCreations)=>Promise<PaginatedCreations>})&(PaginatedCreationsPromiseChain & {get: (request: PaginatedCreationsRequest, defaultValue?:PaginatedCreations)=>Promise<PaginatedCreations>}),myStats:(UserStatsPromiseChain & {get: (request: UserStatsRequest, defaultValue?:UserStats)=>Promise<UserStats>}),sharedVariations:((args?:{limit?: (Scalars['Int'] | null),page?: (Scalars['Int'] | null)})=>PaginatedVariationsPromiseChain & {get: (request: PaginatedVariationsRequest, defaultValue?:PaginatedVariations)=>Promise<PaginatedVariations>})&(PaginatedVariationsPromiseChain & {get: (request: PaginatedVariationsRequest, defaultValue?:PaginatedVariations)=>Promise<PaginatedVariations>}),styles:({get: (request: StyleRequest, defaultValue?:Style[])=>Promise<Style[]>}),surprisePrompts:({get: (request: SurprisePromptRequest, defaultValue?:SurprisePrompt[])=>Promise<SurprisePrompt[]>}),tokenAcquisition:((args:{tokenAcquisitionId: Scalars['String']})=>TokenAcquisitionPromiseChain & {get: (request: TokenAcquisitionRequest, defaultValue?:TokenAcquisition)=>Promise<TokenAcquisition>}),user:((args:{id: Scalars['String']})=>UserPromiseChain & {get: (request: UserRequest, defaultValue?:User)=>Promise<User>})}

export interface QueryObservableChain{creation:((args:{creationId: Scalars['String']})=>CreationObservableChain & {get: (request: CreationRequest, defaultValue?:Creation)=>Observable<Creation>}),me:(UserObservableChain & {get: (request: UserRequest, defaultValue?:User)=>Observable<User>}),myCreations:((args?:{limit?: (Scalars['Int'] | null),page?: (Scalars['Int'] | null)})=>PaginatedCreationsObservableChain & {get: (request: PaginatedCreationsRequest, defaultValue?:PaginatedCreations)=>Observable<PaginatedCreations>})&(PaginatedCreationsObservableChain & {get: (request: PaginatedCreationsRequest, defaultValue?:PaginatedCreations)=>Observable<PaginatedCreations>}),myStats:(UserStatsObservableChain & {get: (request: UserStatsRequest, defaultValue?:UserStats)=>Observable<UserStats>}),sharedVariations:((args?:{limit?: (Scalars['Int'] | null),page?: (Scalars['Int'] | null)})=>PaginatedVariationsObservableChain & {get: (request: PaginatedVariationsRequest, defaultValue?:PaginatedVariations)=>Observable<PaginatedVariations>})&(PaginatedVariationsObservableChain & {get: (request: PaginatedVariationsRequest, defaultValue?:PaginatedVariations)=>Observable<PaginatedVariations>}),styles:({get: (request: StyleRequest, defaultValue?:Style[])=>Observable<Style[]>}),surprisePrompts:({get: (request: SurprisePromptRequest, defaultValue?:SurprisePrompt[])=>Observable<SurprisePrompt[]>}),tokenAcquisition:((args:{tokenAcquisitionId: Scalars['String']})=>TokenAcquisitionObservableChain & {get: (request: TokenAcquisitionRequest, defaultValue?:TokenAcquisition)=>Observable<TokenAcquisition>}),user:((args:{id: Scalars['String']})=>UserObservableChain & {get: (request: UserRequest, defaultValue?:User)=>Observable<User>})}

export interface StylePromiseChain{createdAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),imageUrl:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),name:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),negativePrompt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),prompt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>})}

export interface StyleObservableChain{createdAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),imageUrl:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),name:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),negativePrompt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),prompt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>})}

export interface SurprisePromptPromiseChain{createdAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),prompt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>})}

export interface SurprisePromptObservableChain{createdAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),prompt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>})}

export interface TokenAcquisitionPromiseChain{createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),donationCurrencyToTokenExchangeRate:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Promise<Scalars['Float']>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),paymentProviderTransactionId:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),status:({get:(request?:boolean|number,defaultValue?:TokenAcquisitionStatus)=>Promise<TokenAcquisitionStatus>}),tokenNumber:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),userId:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>})}

export interface TokenAcquisitionObservableChain{createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),donationCurrencyToTokenExchangeRate:({get:(request?:boolean|number,defaultValue?:Scalars['Float'])=>Observable<Scalars['Float']>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),paymentProviderTransactionId:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),status:({get:(request?:boolean|number,defaultValue?:TokenAcquisitionStatus)=>Observable<TokenAcquisitionStatus>}),tokenNumber:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),userId:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>})}

export interface UserPromiseChain{avatarUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),email:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),firstName:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),isActive:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),isLaunchWaitlistMember:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),lastName:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),role:({get:(request?:boolean|number,defaultValue?:UserRole)=>Promise<UserRole>}),tokenNumber:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>})}

export interface UserObservableChain{avatarUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),email:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),firstName:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),isActive:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),isLaunchWaitlistMember:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),lastName:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),role:({get:(request?:boolean|number,defaultValue?:UserRole)=>Observable<UserRole>}),tokenNumber:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>})}

export interface UserStatsPromiseChain{totalCreations:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),totalDonationsByCurrency:(CurrencyToTotalDonationPromiseChain & {get: (request: CurrencyToTotalDonationRequest, defaultValue?:CurrencyToTotalDonation)=>Promise<CurrencyToTotalDonation>}),totalReferrals:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>})}

export interface UserStatsObservableChain{totalCreations:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),totalDonationsByCurrency:(CurrencyToTotalDonationObservableChain & {get: (request: CurrencyToTotalDonationRequest, defaultValue?:CurrencyToTotalDonation)=>Observable<CurrencyToTotalDonation>}),totalReferrals:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>})}

export interface VariationPromiseChain{createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>}),creation:(VariationCreationPromiseChain & {get: (request: VariationCreationRequest, defaultValue?:VariationCreation)=>Promise<VariationCreation>}),creationId:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),imageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),isSharedToCommunity:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Promise<Scalars['String']>})}

export interface VariationObservableChain{createdAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>}),creation:(VariationCreationObservableChain & {get: (request: VariationCreationRequest, defaultValue?:VariationCreation)=>Observable<VariationCreation>}),creationId:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),imageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),isSharedToCommunity:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),updatedAt:({get:(request?:boolean|number,defaultValue?:Scalars['String'])=>Observable<Scalars['String']>})}

export interface VariationCreationPromiseChain{id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Promise<Scalars['ID']>}),iterationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>}),negativePrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),resultImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),startingImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),styles:({get: (request: StyleRequest, defaultValue?:Style[])=>Promise<Style[]>}),textPrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Promise<(Scalars['String'] | null)>}),variationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Promise<Scalars['Int']>})}

export interface VariationCreationObservableChain{id:({get:(request?:boolean|number,defaultValue?:Scalars['ID'])=>Observable<Scalars['ID']>}),iterationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>}),negativePrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),resultImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),startingImageUrl:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),styles:({get: (request: StyleRequest, defaultValue?:Style[])=>Observable<Style[]>}),textPrompt:({get:(request?:boolean|number,defaultValue?:(Scalars['String'] | null))=>Observable<(Scalars['String'] | null)>}),variationCount:({get:(request?:boolean|number,defaultValue?:Scalars['Int'])=>Observable<Scalars['Int']>})}