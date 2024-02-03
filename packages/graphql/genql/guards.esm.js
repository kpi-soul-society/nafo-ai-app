
var CheckoutSession_possibleTypes = ['CheckoutSession']
export var isCheckoutSession = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isCheckoutSession"')
  return CheckoutSession_possibleTypes.includes(obj.__typename)
}



var Creation_possibleTypes = ['Creation']
export var isCreation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isCreation"')
  return Creation_possibleTypes.includes(obj.__typename)
}



var CreationMode_possibleTypes = ['CreationMode']
export var isCreationMode = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isCreationMode"')
  return CreationMode_possibleTypes.includes(obj.__typename)
}



var CurrencyToTotalDonation_possibleTypes = ['CurrencyToTotalDonation']
export var isCurrencyToTotalDonation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isCurrencyToTotalDonation"')
  return CurrencyToTotalDonation_possibleTypes.includes(obj.__typename)
}



var Mutation_possibleTypes = ['Mutation']
export var isMutation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



var PaginatedCreations_possibleTypes = ['PaginatedCreations']
export var isPaginatedCreations = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isPaginatedCreations"')
  return PaginatedCreations_possibleTypes.includes(obj.__typename)
}



var PaginatedVariations_possibleTypes = ['PaginatedVariations']
export var isPaginatedVariations = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isPaginatedVariations"')
  return PaginatedVariations_possibleTypes.includes(obj.__typename)
}



var Query_possibleTypes = ['Query']
export var isQuery = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



var Style_possibleTypes = ['Style']
export var isStyle = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isStyle"')
  return Style_possibleTypes.includes(obj.__typename)
}



var SurprisePrompt_possibleTypes = ['SurprisePrompt']
export var isSurprisePrompt = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isSurprisePrompt"')
  return SurprisePrompt_possibleTypes.includes(obj.__typename)
}



var TokenAcquisition_possibleTypes = ['TokenAcquisition']
export var isTokenAcquisition = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isTokenAcquisition"')
  return TokenAcquisition_possibleTypes.includes(obj.__typename)
}



var User_possibleTypes = ['User']
export var isUser = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isUser"')
  return User_possibleTypes.includes(obj.__typename)
}



var UserStats_possibleTypes = ['UserStats']
export var isUserStats = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isUserStats"')
  return UserStats_possibleTypes.includes(obj.__typename)
}



var Variation_possibleTypes = ['Variation']
export var isVariation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isVariation"')
  return Variation_possibleTypes.includes(obj.__typename)
}



var VariationCreation_possibleTypes = ['VariationCreation']
export var isVariationCreation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isVariationCreation"')
  return VariationCreation_possibleTypes.includes(obj.__typename)
}
