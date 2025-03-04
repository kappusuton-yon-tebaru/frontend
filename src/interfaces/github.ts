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