// Shared types for NFT Gallery
export interface NftAttribute {
  trait_type: string;
  value: string;
}

export interface JsonMetadata {
  name: string;
  image: string;
  attributes: NftAttribute[];
  description?: string;
  symbol?: string;
}

export interface HeliusApiNftContent {
  json_uri: string;
}

export interface HeliusApiNft {
  mint: string;
  content: HeliusApiNftContent;
}

export interface DisplayNft {
  mint: string;
  name: string;
  imageUrl: string;
  attributes: NftAttribute[];
  description?: string;
}
