export interface Committer {
    name: string;
    date: string;
}

export interface BranchObject {
    sha: string;
}

export interface Commit {
    sha: string;
    committer: Committer;
}

export interface Branch {
    name: string;
    object: BranchObject;
    commit: Commit;
}

export interface Content {
    name: string;
    path: string;
    sha: string;
    size: number;
    download_url: string;
}

export interface CommitMetadata {
    lastEditTime: string;
    commitMessage: string;
}

export interface FileOrFolder {
    name: string;
    path: string;
    type: "dir" | "file";
    children?: FileOrFolder[];
}