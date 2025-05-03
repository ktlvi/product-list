export interface ProductProps {
    id: string;
    imageUrl: string;
    name: string;
    count: number;
    size: {
        width: number;
        height: number;
    };
    weight: string;
    comments: CommentProps[];
}
export interface CommentProps {
    id: string;
    productId: number;
    description: string;
    date: string;
}
