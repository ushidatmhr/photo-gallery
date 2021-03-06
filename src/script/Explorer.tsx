import * as React from 'react'
import { File } from './api/Files'
import style from '../style/explorer.scss'

export interface ExplorerProps {
    dirList: File[],
    fileSelect: (dir: File) => void
}

export interface ExplorerState {
    selectedDirName: string
}

export default class Explorer extends React.Component<ExplorerProps, ExplorerState> {

    constructor(props) {
        super(props);

        this.state = {
            selectedDirName: ''
        }

        this.openTree = this.openTree.bind(this);
        this.childNode = this.childNode.bind(this);
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dirList.length == 0 || this.props.dirList[0].path != prevProps.dirList[0].path) {
            var rootDir = this.props.dirList[0];
            if (rootDir) {
                this.selectDir(rootDir);
            }
        }
    }


    /**
     * ディレクトリツリーの開閉を行う
     * @param event イベント
     */
    openTree(dir: File, event: React.MouseEvent<HTMLLIElement>): void {

        event.stopPropagation();

        var ulElement = event.currentTarget.parentElement.parentElement.lastElementChild as HTMLUListElement;
        var naviStr = '';

        switch (ulElement.style.display) {
            case 'block':
                ulElement.style.display = 'none';
                naviStr = "＋";
                break;
            case 'none':
                ulElement.style.display = 'block';
                naviStr = "ー";
                break;
        }

        if (dir.dir.length != 0) {
            event.currentTarget.innerText = naviStr;
        }

    }


    selectDir(dir: File): void {

        this.setState({
            selectedDirName: dir.name
        });

        this.props.fileSelect(dir);
        // this.render();
    }


    /**
     * 
     * @param list この階層で表示するディレクトリ
     * @param parent 親要素
     */
    childNode(list: File[], parent: string): JSX.Element {

        if (!list) {
            return;
        }

        return (
            <ul className={style.dirList} style={{ display: (!parent) ? '' : 'none' }}>
                {list.map((item) => (
                    <li key={item.name}>
                        <section className={style.itemRow}>
                            <span onClick={this.openTree.bind(this, item)} className={style.navi}>
                                {item.dir.length != 0 && "＋"}
                            </span>
                            <span onClick={this.selectDir.bind(this, item)} className={`${style.dirName} ${this.state.selectedDirName == item.name && style.selected}`}>
                                {item.name}
                            </span>
                        </section>
                        {this.childNode(item.dir, item.name)}
                    </li>
                ))}
            </ul>
        )
    }


    render() {
        return (
            <div className={style.dirListContainer}>
                {this.childNode(this.props.dirList, '')}
            </div>
        )
    }
}